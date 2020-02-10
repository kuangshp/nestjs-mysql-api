/*
 * @Description:自定义管道验证uui或者id
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-09 16:37:43
 * @LastEditors  : 水痕
 * @LastEditTime : 2020-01-23 13:14:46
 */
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { isUuidExp } from './../utils';
import { Validator } from 'class-validator';

@Injectable()
export class ParseIdAndUuidPipe implements PipeTransform {
  public validator: Validator;
  constructor () {
    this.validator = new Validator();
  }
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isNaN(parseInt(value, 10)) || this.validator.isUUID(value)) {
      return value;
    } else {
      throw new HttpException(`传递的id必须是整形或者是uuid字符串,你传递的是:${value}`, HttpStatus.BAD_REQUEST);
    }
  }
}
