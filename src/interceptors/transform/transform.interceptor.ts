import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { classToPlain } from 'class-transformer';
import { isObject } from 'util';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (isObject(data) && data.isUploaded) {
          return {
            ...data,
            code: 0,
            message: '请求成功',
          };
        } else {
          return {
            result: classToPlain(data),
            code: 0,
            message: '请求成功',
          };
        }
      }),
    );
  }
}
