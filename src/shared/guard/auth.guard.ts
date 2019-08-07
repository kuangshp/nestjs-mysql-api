import {
  Injectable,
  CanActivate,
  Logger,
  HttpException,
  HttpStatus,
  ExecutionContext,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { InjectConfig, ConfigService } from 'nestjs-config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@InjectConfig() private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      context.switchToRpc().getData().headers.token ||
      context.switchToHttp().getRequest().body.token ||
      this.getUrlParam(request.url, 'token');
    Logger.log(`当前的token: ${token}`, 'AuthGuard');
    // 如果白名单里面有的url就不拦截
    if (this.hasUrl(this.configService.get('project.whiteUrl'), request.url)) {
      return true;
    }
    if (token) {
      try {
        const user = this.verifyToken(token, process.env.SECRET);
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
          reject(error);
        } else {
          resolve(payload);
        }
      });
    });
  }

  /**
   * @param {url}
   * @return:
   * @Description: 在url中获取query字段
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-07-31 13:07:54
   */
  private getUrlParam(
    url: {
      replace: (
        arg0: RegExp,
        arg1: (_$0: any, $1: string | number, $2: any) => void,
      ) => void;
    },
    key: string,
  ): string {
    let result: any;
    const Oparam: { [propName: string]: any } = {};
    url.replace(
      /[\?&]?(\w+)=(\w+)/g,
      (_$0: any, $1: string | number, $2: any) => {
        Oparam[$1] === void 0
          ? (Oparam[$1] = $2)
          : (Oparam[$1] = [].concat(Oparam[$1], $2));
      },
    );
    key === void 0 || key === ''
      ? (result = Oparam)
      : (result = Oparam[key] || '');
    return result;
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
