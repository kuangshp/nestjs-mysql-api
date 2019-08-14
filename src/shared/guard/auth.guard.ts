import {
  Injectable,
  CanActivate,
  Logger,
  HttpException,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectConfig, ConfigService } from 'nestjs-config';

import { getUrlQuery } from './../utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectConfig() private readonly configService: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      context.switchToRpc().getData().headers.token ||
      context.switchToHttp().getRequest().body.token ||
      getUrlQuery(request.url, 'token');
    Logger.log(`当前的token: ${token}`, 'AuthGuard');
    // 如果白名单里面有的url就不拦截
    if (this.hasUrl(this.configService.get('project.whiteUrl'), request.url)) {
      return true;
    }
    if (token) {
      try {
        const user = await this.verifyToken(token, process.env.SECRET);
        request.user = user;
        return true;
      } catch (e) {
        throw new HttpException(
          '没有授权不能访问,请先登录',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException(
        '没有授权不能访问,请先登录',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * @param {token}: token
   * @param {secret}: secret
   * @return:
   * @Description: 校验用户传递过来的token
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-07-31 12:56:01
   */
  private verifyToken(token: string, secret: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, payload) => {
        if (error) {
          console.log('-----------error start--------------');
          console.log(error);
          console.log('-----------error end--------------');
          reject(error);
        } else {
          resolve(payload);
        }
      });
    });
  }

  /**
   * @param {string[]} urlList url列表
   * @param {url} url 当前要判断的url列表
   * @return:
   * @Description: 判断一个url列表中是否包含一个url
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-07 14:28:11
   */
  private hasUrl(urlList: string[], url: string): boolean {
    let flag: boolean = false;
    for (const item of urlList) {
      if (Object.is(item.replace(/\//gi, ''), url.replace(/\//gi, ''))) {
        flag = true;
      }
    }
    return flag;
  }
}
