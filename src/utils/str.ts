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
      const obj = {};
      for (const key in item) {
        obj[toHump(key)] = item[key];
      }
      return obj;
    })
  } else if (isObject(data)) {
    const obj = {};
    for (const key in data) {
      obj[toHump(key)] = data[key];
    }
    return obj;
  } else {
    return toHump(data);
  }
}

/**
 * @Author: 水痕
 * @Date: 2020-02-21 10:20:06
 * @LastEditors: 水痕
 * @Description: 
 * @param randomFlag {Boolean} 是否任意长度
 * @param min {Number} 任意长度最小位[固定位数]
 * @param max {Number} 任意长度最大位
 * @return: 
 */
export const randomWord = (randomFlag = true, min = 10, max = 20): string => {
  let str = '';
  let range = min;
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

/**
 * @Author: 水痕
 * @Date: 2020-04-02 12:56:48
 * @LastEditors: 水痕
 * @Description: 根据时间生成交易号 生成订单号，格式：YYYYMMDDhhmmssRandom4
 * @param {type}
 * @return:
 */
export const generateTradeNo = () => {
  const now = new Date();
  const year = now.getFullYear() + '';
  const month = (now.getMonth() > 9 ? '' : '0') + (now.getMonth() + 1);
  const day = (now.getDate() > 9 ? '' : '0') + now.getDate();
  const hour = now.getHours() > 9 ? now.getHours() + '' : '0' + now.getHours();
  const minute = now.getMinutes() > 9 ? now.getMinutes() + '' : '0' + now.getMinutes();
  const seconds = now.getSeconds() > 9 ? now.getSeconds() + '' : '0' + now.getSeconds();
  return year + month + day + hour + minute + seconds + Math.random().toString().substr(2, 4);
}

export const hideMobileNumber = (tel: string): string => {
  // d表示数字0-9,{3}表示需要3个，所以d{3}就是表示3个数字
  const reg = /(\d{3})\d{4}(\d{4})/;
  //$1是第一个小括号里的 ,$2是第2个小括号里的
  return tel.replace(reg, "$1****$2");
}