/*
 * @Description:自定义管道验证uui或者id
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-09 16:37:43
 * @LastEditors: 水痕
 * @LastEditTime: 2019-08-10 09:51:47
 */
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { isUuidExp } from './../utils';

@Injectable()
export class ParseIdAndUuidPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isNaN(parseInt(value, 10)) || !isUuidExp.test(value)) {
      return value;
    } else {
      throw new HttpException('参数必须为id或者uuid', HttpStatus.BAD_REQUEST);
    }
  }
}
