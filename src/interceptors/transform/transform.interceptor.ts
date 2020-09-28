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
        // 专门处理下上传图片的(文本编辑器使用)
        if (isObject(data) && data.isUpload) {
          return {
            link: data.result.url,
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
