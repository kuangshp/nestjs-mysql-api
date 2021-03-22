import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsEqual(property: string,validationOptions?: ValidationOptions):Function {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        // value是当前被装饰的字段的值
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            value === relatedValue
          );
        },
        defaultMessage() {
          return '两次密码不一致';
        },
      },
    });
  };
}