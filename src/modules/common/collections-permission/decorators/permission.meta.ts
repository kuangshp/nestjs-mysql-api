import { applyDecorators, SetMetadata } from '@nestjs/common';
import { PERMISSION_META } from './../constants/permission';

/**
 * @Author: 水痕
 * @Date: 2021-09-27 16:09:57
 * @LastEditors: 水痕
 * @Description: 使用在方法上的装饰器
 * @param {string} name
 * @return {*}
 */
export const PermissionMeta = (name: string): MethodDecorator & ClassDecorator => {
  return applyDecorators(SetMetadata(PERMISSION_META, name));
};
