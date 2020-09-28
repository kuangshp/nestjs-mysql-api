/**
 * @Author: 水痕
 * @Date: 2020-03-13 10:33:24
 * @LastEditors: 水痕
 * @Description: 判断数组是否包括另外一个数组(arr2是否包含在arr1)
 * @param {type} 
 * @return: 
 */
export const includesArray = (arr1: any[], arr2: any[]): boolean => {
  return arr2.every(val => arr1.includes(val));
}