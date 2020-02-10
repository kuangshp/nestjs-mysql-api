import {
  Injectable,
  CanActivate,
  Logger,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

/*
 * @Description:基于角色的守卫
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-07-29 13:53:00
 * @LastEditors: 水痕
 * @LastEditTime: 2019-07-29 13:55:42
 */

@Injectable()
export class RolesGuard implements CanActivate {
  // 使用反射
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    Logger.log('----------角色守卫start----------------');
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('roles', roles);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('没权限访问');
    }
    console.log('当前用户', user);
    console.log('全部的角色', user.roles);
    const hasRole = () => user.roles.some(role => roles.includes(role));
    Logger.log('----------角色守卫end----------------');
    return user && user.roles && hasRole();
  }
}
