import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getUrlQuery } from '@src/utils';
import { CodeEnum, CodeMessage } from '@src/enums/code.enum';

const SECRET = process.env.SECRET as string;

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
        const user = await this.verifyToken(token, SECRET);
        if (user) {
          request.user = user;
          return true;
        } else {
          throw new HttpException(JSON.stringify({ code: CodeEnum.TOKEN_ERROR, message: CodeMessage[CodeEnum.TOKEN_ERROR] }), HttpStatus.OK);
        }
      } catch (e) {
        Logger.error(e, 'auth');
        throw new HttpException(e, e.status);
      }
    } else {
      throw new HttpException(JSON.stringify({ code: CodeEnum.NO_TOKEN, message: CodeMessage[CodeEnum.NO_TOKEN] }), HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-22 11:13:07
   * @LastEditors: 水痕
   * @Description: 校验用户传递过来的token
   * @param {string} token
   * @param {string} secret
   * @return {*}
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
