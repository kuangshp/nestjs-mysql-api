/*
 * @Description:自定义装饰器用来获取当前用户
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-09 15:49:01
 * @LastEditors: 水痕
 * @LastEditTime: 2019-08-09 15:50:37
 */

import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, req) => {
  if (data) {
    return req.user[data];
  }
  return req.user;
});
