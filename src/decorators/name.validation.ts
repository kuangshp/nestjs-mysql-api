/*
 * @Description:用于dto上校验用户输入的用户名、邮箱、手机号码
 * @Author: 水痕
 * @Github: https://github.com/kuangshp
 * @Email: 332904234@qq.com
 * @Company:
 * @Date: 2019-08-14 10:59:41
 * @LastEditors: 水痕
 * @LastEditTime: 2019-08-14 13:04:08
 */
import { isEmailExp, isMobileExp, isNameExp } from './../utils';
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  Validator,
} from 'class-validator';

export const IsValidationName = (validationOptions: ValidationOptions = {}) => {
  validationOptions = {
    ...validationOptions,
    ...{ message: '请输入有效的用户名/手机号码/邮箱' },
  };
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isValidationName',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (validationOptions.each) {
            for (const item of value) {
              if (!isValidationName(item)) {
                return false;
              }
            }
            return true;
          }
          return isValidationName(value);
        },
      },
    });
  };
};

/**
 * @param {type}
 * @return:
 * @Description:定义一个根据正则校验用户名是否满足手机号码、邮箱、用户名的标准
 * @Author: 水痕
 * @LastEditors: 水痕
 * @Date: 2019-08-14 11:23:24
 */
const isValidationName = (value: string): boolean => {
  const validator: Validator = new Validator();
  // 使用自己写的正则或者直接使用官方提供的
  if (
    // isMobileExp.test(value) ||
    // isEmailExp.test(value) ||
    validator.isMobilePhone(value, 'zh-CN') ||
    validator.isEmail(value) ||
    isNameExp.test(value)
  ) {
    return true;
  } else {
    return false;
  }
};
