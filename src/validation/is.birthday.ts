import * as moment from 'moment';

import { ValidationOptions, Validator, registerDecorator, ValidationArguments } from 'class-validator';

export function IsBirthday(validationOptions: ValidationOptions = {}) {
  validationOptions = Object.assign(validationOptions, { message: '出生年月格式化错误' });
  const validator: Validator = new Validator();
  // 必须返回布尔值
  const isBirthday = (value: Date) => validator.isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(moment(new Date(value)).format('YYYY-MM-DD'));
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isBirthday',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (validationOptions.each) {
            for (const item of value) {
              if (!isBirthday(item)) {
                return false;
              }
            }
            return true;
          }
          return isBirthday(value);
        }
      }
    })
  }
}