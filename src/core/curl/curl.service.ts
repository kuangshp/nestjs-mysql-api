import { Injectable, HttpService } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable()
export class CurlService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * @param {url} : 当前的url地址
   * @param {params} : 参数
   * @return:
   * @Description: get请求别的服务器上的接口进行转发到前端页面
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-02 13:34:42
   */
  get(url: string, params?: { [propsName: string]: any }): Observable<any> {
    const formatUrl = url.endsWith('?')
      ? `${url}${this.params2Str(params)}`
      : `${url}?${this.params2Str(params)}`;
    return this.httpService.get(formatUrl).pipe(
      map(res => res.data),
      timeout(5000),
      catchError(error => of(`Bad Promise: ${error}`)),
    );
  }

  /**
   * @param {url} : url地址
   * @param {data} : 提交给后台的数据
   * @return:
   * @Description: post请求
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-02 13:42:35
   */
  post(url: string, data: { [propsName: string]: any }): Observable<any> {
    return this.httpService.post(url, data).pipe(
      map(res => res.data),
      catchError(error => of(`失败的请求:${error}`)),
    );
  }

  private params2Str(params: { [propsName: string]: any }): string {
    if (!params || !Object.keys(params)) {
      return '';
    }
    return Object.keys(params)
      .map(item => `${item}=${params[item]}`)
      .join('&');
  }
}
