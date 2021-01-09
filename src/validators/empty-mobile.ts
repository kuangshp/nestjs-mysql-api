import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator'

export const IsEmptyStringOrMobile = (validationOptions: ValidationOptions = {}) => {
  validationOptions = Object.assign(validationOptions, { message: '手机号码格式错误' });
  const isEmptyStringOrMobile = value => {
    console.log(value, '???')
    // return IsEmpty(value) || IsMobilePhone('zh-CN', value)
    return true;
  };
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isEmptyStringOrMobile',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          if (validationOptions.each) {
            for (const item of value) {
              if (!isEmptyStringOrMobile(item)) {
                return false;
              }
            }
            return true;
          }
          isEmptyStringOrMobile(value);
        }
      }
    })
  }
}