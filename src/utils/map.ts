import { ObjectType } from '@src/types/obj-type';

/**
 * @Author: 水痕
 * @Date: 2021-03-26 14:35:21
 * @LastEditors: 水痕
 * @Description: 将map转换为对象
 * @param {Map} map
 * @param {*} any
 * @return {*}
 */
export const mapToObj = (map: Map<string, any>): ObjectType => {
  const obj: ObjectType = {};
  for (const [k, v] of map) {
    obj[k] = v;
  }
  return obj;
};
