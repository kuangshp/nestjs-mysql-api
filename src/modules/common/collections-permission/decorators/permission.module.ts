import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PERMISSION_MODULE } from './../constants/permission';

/**
 * @Author: 水痕
 * @Date: 2021-09-27 16:10:13
 * @LastEditors: 水痕
 * @Description: 使用在类上的装饰器
 * @param {string} name
 * @return {*}
 */
export const PermissionModule = (name: string): MethodDecorator & ClassDecorator => {
  return applyDecorators(SetMetadata(PERMISSION_MODULE, name));
};
