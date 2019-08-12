/**
 * @param {type}
 * @return:
 * @Description:在修改数据的时候将对象转换为key=val,key1=val1的类型
 * @Author: 水痕
 * @LastEditors: 水痕
 * @Date: 2019-08-12 15:35:15
 */
export const sqlParamsJoin = (data: { [propsName: string]: any }): string => {
  const result = [];
  Object.keys(data).forEach(key => {
    if (data[key]) {
      result.push(`${key}='${data[key]}'`);
    }
  });
  return result.join(',');
};
