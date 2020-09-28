import {
  Injectable,
  CanActivate,
  Logger,
  HttpException,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getUrlQuery } from '@src/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      context.switchToRpc().getData().headers.token ||
      context.switchToHttp().getRequest().body.token ||
      getUrlQuery(request.url, 'token');
    Logger.log(`当前的token: ${token}`, 'AuthGuard');
    if (token) {
      try {
        const user = await this.verifyToken(token, process.env.SECRET);
        if (user) {
          request.user = user;
          return true;
        } else {
          throw new HttpException(JSON.stringify({ message: 'token失效', code: 10042 }), HttpStatus.OK);
        }
      } catch (e) {
        Logger.error(e, 'auth');
        throw new HttpException(JSON.stringify({ message: 'token失效', code: 10042 }), HttpStatus.OK);
      }
    } else {
      throw new HttpException('你还没登录,请先登录', HttpStatus.OK);
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
    return new Promise((resolve) => {
      jwt.verify(token, secret, (error, payload) => {
        if (error) {
          console.log('-----------error start--------------');
          console.log(error);
          console.log('-----------error end--------------');
          throw new HttpException('token不合法', HttpStatus.OK);
        } else {
          resolve(payload);
        }
      });
    });
  }
}
