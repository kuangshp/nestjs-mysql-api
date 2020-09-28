/*
 * @Description: 自定义获取ip地址的装饰器
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company: 
 * @Date: 2020-02-20 17:40:51
 * @LastEditors: 水痕
 * @LastEditTime: 2020-05-18 12:48:21
 * @FilePath: /nest-framework/src/decorators/ip.address.ts
 * npm install --save request-ip
 * npm install --save-dev @types/request-ip
 */
import { createParamDecorator } from '@nestjs/common';

import * as requestIp from 'request-ip';

export const IpAddress = createParamDecorator((data, req) => {
  if (req.clientIp) {
    return req.clientIp;
  }
  return requestIp.getClientIp(req); // In case we forgot to include requestIp.mw() in main.ts
});