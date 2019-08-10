/*
 * @Description:自定义管道,根据自己格式返回错误信息
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-07-24 14:26:27
 * @LastEditors: 水痕
 * @LastEditTime: 2019-08-10 17:42:42
 */
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import * as _ from 'lodash';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    Logger.log(errors);
    if (errors.length > 0) {
      // 遍历全部的错误信息,返回给前端
      const errorMessage = errors.map(item => {
        return {
          currentValue: item.value,
          [item.property]: _.values(item.constraints)[0],
        };
      });
      throw new HttpException(
        { message: errorMessage },
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
