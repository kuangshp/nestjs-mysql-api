/*
 * @Description:校验参数可传递与不传递
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-09 16:42:10
 * @LastEditors: 水痕
 * @LastEditTime: 2019-08-09 17:14:07
 */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOptionalPipe implements PipeTransform {
  private params: string | number;
  constructor(params: string | number) {
    this.params = params;
  }
  transform(value: any, metadata: ArgumentMetadata) {
    let result = value;
    if (!value) {
      result = this.params;
    }
    return result;
  }
}
