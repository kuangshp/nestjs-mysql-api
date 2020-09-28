import { humpToLine } from './str';
import { fileObjectField } from './object';
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
  Object.keys(fileObjectField(data)).forEach(key => {
    result.push(`${humpToLine(key)}='${data[key]}'`);
  });
  return ` ${result.join(',')} `;
};

/**
 * @param {type}
 * @return:
 * @Description: 拼接插入数据的sql语句
 * @Author: 水痕
 * @LastEditors: 水痕
 * @Date: 2019-08-13 11:58:59
 */
export const sqlInsertJoin = (data: { [propsName: string]: any }): string => {
  const keys = [];
  const values = [];
  Object.keys(fileObjectField(data)).forEach(key => {
    keys.push(humpToLine(key));
    values.push(data[key]);
  });
  return ` (${keys.join(',')}) values (${values.join(',')}) `;
};

/**
 * @Author: 水痕
 * @Date: 2020-01-25 19:39:17
 * @LastEditors: 水痕
 * @Description: 拼接sql的where语句
 * @param {type} 
 * @return: 
 */
export const sqlWhere = (data: { [propsName: string]: any }, tableName?: string): string => {
  const fileFieldObject = fileObjectField(data);
  if (Object.keys(fileFieldObject).length) {
    const sqlList = Object.keys(fileObjectField(data)).reduce((cur, next) => {
      if (tableName) {
        cur.push(`${tableName}.${humpToLine(next)}='${data[next]}'`);
      } else {
        cur.push(`${humpToLine(next)}='${data[next]}'`);
      }
      return cur;
    }, []);
    return ` where ${sqlList.join(' and ')} `;
  } else {
    return '';
  }
}

/**
 * @Author: 水痕
 * @Date: 2020-02-19 11:29:58
 * @LastEditors: 水痕
 * @Description: 拼接in语句sql
 * @param {type} 
 * @return: 
 */
export const sqlIn = (ids: number | number[]): string => {
  let result = '';
  if (Array.isArray(ids)) {
    result = `("${ids.join('","')}")`;
  } else {
    result = `("${ids}")`;
  }
  return result;
}