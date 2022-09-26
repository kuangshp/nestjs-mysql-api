import { applyDecorators, SetMetadata } from '@nestjs/common';
import {
  REDIS_CACHE_KEY,
  REDIS_CACHE_EX_SECOND_KEY,
  REDIS_CACHE_EX_DIFF_USER_KEY,
} from '@src/constants';

interface IParams {
  /** 过期时间 单位为妙*/
  exSecond?: number;
  /**是否要区分用户 */
  isDiffUser?: boolean;
}
// 初始化值
const defaultParams: IParams = {
  exSecond: 60, // 默认缓存时间1分钟
  isDiffUser: false, // 不区分用户
};

/**
 * @Author: 水痕
 * @Date: 2022-08-12 22:09:24
 * @LastEditors: 水痕
 * @Description: 自定义装饰器,用于路由上装饰需要缓存的接口
 * @return {*}
 */
export function RedisCacheApi(params: IParams = defaultParams): any {
  return applyDecorators(
    SetMetadata(REDIS_CACHE_KEY, true),
    SetMetadata(REDIS_CACHE_EX_SECOND_KEY, params.exSecond),
    SetMetadata(REDIS_CACHE_EX_DIFF_USER_KEY, params.isDiffUser)
  );
}
