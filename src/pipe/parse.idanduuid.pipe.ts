/*
 * @Description:自定义管道验证uui或者id
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-09 16:37:43
 * @LastEditors: 水痕
 * @LastEditTime: 2020-05-18 12:33:22
 */
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { isUUID } from 'class-validator';

@Injectable()
export class ParseIdAndUuidPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isNaN(parseInt(value, 10)) || isUUID(value)) {
      return value;
    } else {
      throw new HttpException(`传递的id必须是整形或者是uuid字符串,你传递的是:${value}`, HttpStatus.BAD_REQUEST);
    }
  }
}
