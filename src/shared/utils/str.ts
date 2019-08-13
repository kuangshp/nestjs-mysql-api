import { isString } from './data-type';

/**
 * @param {type}
 * @return:
 * @Description: 将驼峰的key转换为下划线的(eg: createAt--> create_at)
 * @Author: 水痕
 * @LastEditors: 水痕
 * @Date: 2019-08-13 12:18:07
 */
export const humpToLine = (str: string): string => {
  if (isString(str)) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  } else {
    throw new TypeError(`传递的${str}不是字符串`);
  }
};
