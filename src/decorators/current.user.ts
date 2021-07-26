import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (data && request.user) {
    return request.user[data];
  } else {
    return request.user;
  }
});

/**
 * 定义当前用户的数据类型
 */
export interface ICurrentUserType {
  id: number;
  username: string;
  email: string;
  mobile: string;
  isSuper: number;
  platform: number;
}
