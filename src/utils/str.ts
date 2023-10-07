import crypto from 'crypto';
/**
 * @Author: 水痕
 * @Date: 2023-10-07 18:53:32
 * @LastEditors: 水痕
 * @Description: 随机生成指定范围内的随机数
 * @param {number} min
 * @param {number} max
 * @return {*}
 */
export const getRandomNum = (min: number, max: number): number => {
  return Math.floor(min + Math.random() * (max - min));
};

/**
 * @Author: 水痕
 * @Date: 2023-10-07 18:56:03
 * @LastEditors: 水痕
 * @Description: 生成随机长度的字符串
 * @param {number} length
 * @return {*}
 */
export const randomString = (length: number): string => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

/**
 * @Author: 水痕
 * @Date: 2023-10-07 19:06:42
 * @LastEditors: 水痕
 * @Description: 字符串md5加密
 * @param {string} str
 * @return {*}
 */
export const strToMd5 = (str: string): string => {
  const md5 = crypto.createHash('md5');
  return md5.update(str).digest('hex');
};
