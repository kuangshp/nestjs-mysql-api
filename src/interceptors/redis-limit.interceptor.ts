import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUserType } from '@src/decorators';

import {
  REDIS_LIMIT_RANGE_SECOND_KEY,
  REDIS_LIMIT_KEY,
  REDIS_LIMIT_MAX_REQUEST_KEY,
} from '@src/constants';
import { RedisService } from '@src/plugin/redis/redis.service';
import { ToolsService } from '@src/plugin/tools/tools.service';

type IRequest = Request & { user: ICurrentUserType };

@Injectable()
export class RedisLimitInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisService,
    private readonly toolsService: ToolsService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    console.log('限流拦截器');
    const request: IRequest = context.switchToHttp().getRequest();
    const currentIp = this.toolsService.getReqIP(request);
    const redisKey = `redis_limit_ip_${currentIp}`;
    // 是否需要限流
    const isLimitApi =
      Reflect.getMetadata(REDIS_LIMIT_KEY, context.getHandler()) ||
      Reflect.getMetadata(REDIS_LIMIT_KEY, context.getClass());
    // 限流时间范围内
    const redisRangeSecond =
      Reflect.getMetadata(REDIS_LIMIT_RANGE_SECOND_KEY, context.getHandler()) ||
      Reflect.getMetadata(REDIS_LIMIT_RANGE_SECOND_KEY, context.getClass());
    // 限流时间范围内最大访问次数
    const redisMaxRequest =
      Reflect.getMetadata(REDIS_LIMIT_MAX_REQUEST_KEY, context.getHandler()) ||
      Reflect.getMetadata(REDIS_LIMIT_MAX_REQUEST_KEY, context.getClass());
    if (isLimitApi) {
      console.log('走限流操作');
      const currentCount = await this.redisService.get(redisKey);
      if (currentCount) {
        // 先判断是否达到上线了
        if (currentCount >= redisMaxRequest) {
          throw new HttpException('访问过于频繁', HttpStatus.TOO_MANY_REQUESTS);
        }
        await this.redisService.incr(redisKey);
        return next.handle();
      } else {
        await this.redisService.set(redisKey, 1, redisRangeSecond);
        return next.handle();
      }
    } else {
      return next.handle();
    }
  }
}
