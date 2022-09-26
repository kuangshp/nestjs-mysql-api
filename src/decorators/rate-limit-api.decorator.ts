import { applyDecorators, SetMetadata } from '@nestjs/common';
import {
  REDIS_LIMIT_KEY,
  REDIS_LIMIT_RANGE_SECOND_KEY,
  REDIS_LIMIT_MAX_REQUEST_KEY,
} from '@src/constants';

interface IParams {
  /** 时间单位为妙*/
  exSecond?: number;
  /** 最大访问次数 */
  maxRequest?: number;
}
// 初始化值
const defaultParams: IParams = {
  exSecond: 60, // 默认缓存时间1分钟
  maxRequest: 3, // 一分钟访问100次
};

/**
 * @Author: 水痕
 * @Date: 2022-08-13 10:45:45
 * @LastEditors: 水痕
 * @Description: 自定义装饰器来实现接口限流
 * @param {IParams} params
 * @return {*}
 */
export function RedisLimitApi(params: IParams = defaultParams): any {
  return applyDecorators(
    SetMetadata(REDIS_LIMIT_KEY, true),
    SetMetadata(REDIS_LIMIT_RANGE_SECOND_KEY, params.exSecond),
    SetMetadata(REDIS_LIMIT_MAX_REQUEST_KEY, params.maxRequest)
  );
}
