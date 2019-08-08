/*
 * @Description:定义分页拦截器,在需要使用的地方进行装饰器拦截
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-08 15:10:13
 * @LastEditors: 水痕
 * @LastEditTime: 2019-08-08 15:28:13
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getUrlQuery } from './../utils';
import { InjectConfig, ConfigService } from 'nestjs-config';

@Injectable()
export class PaginateInterceptor implements NestInterceptor {
  constructor(@InjectConfig() private readonly configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.switchToHttp().getRequest();
    let pageSize: number = this.configService.get('project.pageSize') || 10; // 一次请求多少条数据
    let pageNumber: number = this.configService.get('project.pageNumber') || 1; // 当前第几页
    // 区分是get请求还是post请求
    if (request.method === 'GET') {
      // 从url中提取pageSize和pageNumber
      const size = Number.parseInt(getUrlQuery(request.url, 'pageSize'), 10);
      const num = Number.parseInt(getUrlQuery(request.url, 'pageNumber'), 10);
      pageSize = size ? size : 10;
      pageNumber = num ? num : 1;
    } else if (request.method === 'POST') {
      const body: any = request.body;
      const { pageSize: size, pageNumber: num } = body;
      pageSize = size ? size : 10;
      pageNumber = num ? num : 1;
    }
    return next.handle().pipe(
      map(res => {
        const [data, total] = res;
        return {
          data,
          total,
          pageSize,
          pageNumber,
        };
      }),
    );
  }
}
