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
  let obj: ObjectType = {};
  for (let [k, v] of map) {
    obj[k] = v;
  }
  return obj;
}
