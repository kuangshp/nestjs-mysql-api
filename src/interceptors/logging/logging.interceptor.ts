import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { LoggerService } from '@src/modules/shared/services/logger/logger.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new LoggerService(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    /**当前请求方式 */
    const method = request.method;
    /**当前请求路径 */
    const url = request.url;
    const now = Date.now();
    /**当前请求参数 */
    const body = request.body;
    /**当前params参数 */
    const params = request.params;
    /**当前query参数 */
    const query = request.query;
    /**当前用户信息 */
    const user = request.user;
    return next.handle().pipe(
      tap(() => {
        Logger.log(`${method} ${url} ${Date.now() - now}ms`, context.getClass().name);
      }),
      map((data) => {
        const message = {
          url,
          method,
          user,
          body,
          params,
          query,
          data,
        };
        this.logger.info(message, '中间件记录日志');
        return data;
      }),
    );
  }
}
