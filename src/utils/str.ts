import { isString, isObject } from './data-type';

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

/**
 * @Author: 水痕
 * @Date: 2020-01-31 16:24:23
 * @LastEditors: 水痕
 * @Description: 将下划线转驼峰
 * @param {type} 
 * @return: 
 */
export const toHump = (name: string): string => {
  if (name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
  }
}

/**
 * @Author: 水痕
 * @Date: 2020-02-02 14:27:26
 * @LastEditors: 水痕
 * @Description: 将下划线的sql转换驼峰命名的方式
 * @param {type} 
 * @return: 
 */
export const sqlToHump = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      let obj = {};
      for (let key in item) {
        obj[toHump(key)] = item[key];
      }
      return obj;
    })
  } else if (isObject(data)) {
    let obj = {};
    for (let key in data) {
      obj[toHump(key)] = data[key];
    }
    return obj;
  } else {
    return toHump(data);
  }
}