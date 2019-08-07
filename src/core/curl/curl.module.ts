/*
 * @Description:封装数据接口请求的模块
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-02 12:27:50
 * @LastEditors: 水痕
 * @LastEditTime: 2019-08-06 17:40:01
 */
import { Module, HttpModule, Global } from '@nestjs/common';
import { CurlService } from './curl.service';

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [CurlService],
  exports: [HttpModule, CurlModule, CurlService],
})
export class CurlModule {}
