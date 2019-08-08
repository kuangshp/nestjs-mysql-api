import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return {
          result: Reflect.has(data, 'pageSize') ? { ...data } : { data }, // 如果有分页的就解构出来,没有就直接返回
          code: 0,
          message: '请求成功',
        };
      }),
    );
  }
}
