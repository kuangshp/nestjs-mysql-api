import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * @Author: 水痕
 * @Date: 2021-03-22 11:41:12
 * @LastEditors: 水痕
 * @Description: 从请求头中获取ip地址，需要配置nginx才能拿到ip
 * @param {*} createParamDecorator
 * @return {*}
 */
export const IpAddress = createParamDecorator((_data: string, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();
  const rawIp: string | undefined = req.header('x-forwarded-for') ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ipAddress = rawIp ? rawIp!.split(',')[0] : '';
  return ipAddress;
});