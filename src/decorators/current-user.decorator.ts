import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 定义当前用户的数据类型
 */
export interface ICurrentUserType {
  id: number; // 账号id
  accountId: number; // 账号id
  username: string; // 用户名
  tenantId: number; // 商户id
  accountType: number; // 账号类型:0普通账号,1是主账号,2是超管
}

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data && request.user) {
    return request.user[data];
  } else {
    return request.user;
  }
});
