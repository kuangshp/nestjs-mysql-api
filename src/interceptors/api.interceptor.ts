import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoginTokenDataVo } from '@src/api/login/vo/login.vo';
import { AccountTypeEnum } from '@src/enums/account.type.enum';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements NestInterceptor {
  // 可以直接访问的
  private readonly whiteUrlList: string[] = ['/menus/btnList', '/menus'];
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    /**当前请求方式 */
    const method = request.method;
    /**当前请求路径 */
    const url = request.url;
    const user = request.user as LoginTokenDataVo;
    const newUrl = url
      .replace('//', '/') // 去除双//
      .replace('/api/v1/admin', '') // 去除双//
      .replace(/\?.*/, '') // 去除最后一个
      .replace(/(\d+)$/, '*');
    console.log(newUrl, '-------------');
    if (this.whiteUrlList.includes(newUrl)) {
      return next.handle();
    }
    if (user) {
      const {
        userInfo: { accountType },
      } = user;
      if (accountType == AccountTypeEnum.SUPER_ACCOUNT) {
        return next.handle();
      }
      // 表示已经登录的
      const currentItem = user.authApi.find((item) => item.method == method && item.url == newUrl);
      console.log(currentItem, '???');
      if (currentItem) {
        return next.handle();
      } else {
        throw new HttpException(
          JSON.stringify({ code: 10034, message: '你没权限访问' }),
          HttpStatus.OK
        );
      }
    }
    return next.handle();
  }
}
