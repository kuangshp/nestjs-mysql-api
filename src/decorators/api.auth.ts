import { applyDecorators, SetMetadata } from '@nestjs/common';
import { API_AUTH_KEY } from '@src/constants';

/**
 * @Author: 水痕
 * @Date: 2021-04-07 13:43:58
 * @LastEditors: 水痕
 * @Description: 自定义API守卫装饰器
 * @param {*}
 * @return {*}
 */
export function ApiAuth(): Function {
  return applyDecorators(SetMetadata(API_AUTH_KEY, true));
}
