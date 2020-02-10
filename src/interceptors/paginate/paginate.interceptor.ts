import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { InjectConfig, ConfigService } from 'nestjs-config';
import { getUrlQuery } from '@src/utils';

@Injectable()
export class PaginateInterceptor implements NestInterceptor {
  constructor (@InjectConfig() private readonly configService: ConfigService) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest();
    let pageSize: number = this.configService.get('admin.pageSize') || 10; // 一次请求多少条数据
    let pageNumber: number = this.configService.get('admin.pageNumber') || 1; // 当前第几页
    // 区分是get请求还是post请求
    if (request.method === 'GET') {
      // 从url中提取pageSize和pageNumber
      const size = Number.parseInt((getUrlQuery(request.url, 'pageSize') as string), 10);
      const num = Number.parseInt((getUrlQuery(request.url, 'pageNumber') as string), 10);
      if (size) {
        pageSize = size;
      }
      if (num) {
        pageNumber = num;
      }
    } else if (request.method === 'POST') {
      const body: any = request.body;
      const { pageSize: size, pageNumber: num } = body;
      if (size) {
        pageSize = size;
      }
      if (num) {
        pageNumber = num;
      }
    }
    return next.handle().pipe(
      map(res => {
        const [data, total] = res;
        return {
          data,
          total,
          pageSize,
          pageNumber,
        };
      }),
    );
  }
}
