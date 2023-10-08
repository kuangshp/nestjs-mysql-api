/**
 * @Author:
 * @Date: 2023-05-20 09:13:32
 * @LastEditors:
 * @Description: 根据两个列表取并集
 * @param {number} list1
 * @param {number} list2
 * @return {*}
 */
export const getB = (list1: number[], list2: number[]): number[] => {
  return [...list1, ...list2];
};
/**
 * @Author:
 * @Date: 2023-05-20 09:16:05
 * @LastEditors:
 * @Description: 两个列表取交集
 * @param {number} list1
 * @param {number} list2
 * @return {*}
 */
export const getJ = (list1: number[], list2: number[]): number[] => {
  if (list1.length > list2.length) {
    return list1.filter((item) => list2.includes(item));
  } else {
    return list2.filter((item) => list1.includes(item));
  }
};
/**
 * @Author:
 * @Date: 2023-05-20 09:16:17
 * @LastEditors:
 * @Description: 两个列表取差集
 * @param {number} list1
 * @param {number} list2
 * @return {*}
 */
export const getC = (list1: number[], list2: number[]): number[] => {
  if (list1.length > list2.length) {
    return list1.filter((item) => !list2.includes(item));
  } else {
    return list2.filter((item) => !list1.includes(item));
  }
};
