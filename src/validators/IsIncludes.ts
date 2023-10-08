import { ValidationOptions, ValidateBy, buildMessage } from 'class-validator';

/**
 * 校验数组包括元素
 * @param max 最大长度
 * @param validationOptions 参数
 */
export function IsIncludes(list: any[], validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isIncludes',
      constraints: [list],
      validator: {
        validate: (value): boolean => {
          if (value) {
            return list.includes(value);
          } else {
            return true;
          }
        },
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + '$property 只能是其中 $constraint1 的一个',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
