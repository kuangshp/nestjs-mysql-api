
import { ArgumentMetadata, Injectable, PipeTransform, Logger, HttpException, HttpStatus, } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { values } from 'lodash';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    // 如果没有传入验证规则，则不验证，直接返回数据
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // 将对象转换为 Class 来验证
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    Logger.log(errors, 'validation.pipe处理');
    if (errors.length > 0) {
      // 遍历全部的错误信息,返回给前端
      // const errorMessage = errors.map(item => {
      //   return {
      //     currentValue: item.value === undefined ? '' : item.value,
      //     [item.property]: _.values(item.constraints)[0],
      //   };
      // });
      //获取第一个错误并且返回
      const msg = values(errors[0].constraints)[0];
      // 统一抛出异常
      throw new HttpException(
        { message: msg },
        HttpStatus.OK,
      );
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}