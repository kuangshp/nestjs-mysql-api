import { ObjectType } from '@src/types';

/**
 * @Author: 水痕
 * @Date: 2020-01-24 19:38:49
 * @LastEditors: 水痕
 * @Description: 过滤对象中空的提交到后台
 * @param {type}
 * @return:
 */
export const fileObjectField = (data: object): object => {
  return Object.keys(data).reduce((cur, next) => {
    if (data[next] || /^\d+$/.test(data[next])) {
      cur[next] = data[next];
    }
    return cur;
  }, {});
}

/**
 * @Author: 水痕
 * @Date: 2020-01-27 09:47:14
 * @LastEditors: 水痕
 * @Description: 去除对象value的前后空格
 * @param {type}
 * @return:
 */
export const trimObject = (data: ObjectType): ObjectType => {
  return Object.keys(data).reduce((cur, next) => {
    cur[next] = isNaN(data[next]) ? data[next].trim() : data[next];
    return cur;
  }, {});
}


/**
 * @Author: 水痕
 * @Date: 2020-01-27 10:09:20
 * @LastEditors: 水痕
 * @Description: 处理的数据
 * @param {type}
 * @return:
 */
export const channelObject = (data: ObjectType): ObjectType => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return decodeObject(fileObjectField(trimObject(data)));
}


/**
 * @Author: 水痕
 * @Date: 2020-01-27 10:22:47
 * @LastEditors: 水痕
 * @Description: 将前端使用encodeURL转义的字符转换回来
 * @param {type} 
 * @return: 
 */
export const decodeObject = (data: object): ObjectType => {
  return Object.keys(data).reduce((cur, next) => {
    cur[next] = decodeURI(data[next]);
    return cur;
  }, {});
}

/**
 * @Author: 水痕
 * @Date: 2020-03-28 09:06:02
 * @LastEditors: 水痕
 * @Description: 根据对象的key重新排序返回一个新的对象
 * @param {type} 
 * @return: 
 */
export const objectKeySort = (obj: ObjectType): ObjectType => {
  return Object.keys(obj).sort().reduce((cur, next) => {
    cur[next] = obj[next];
    return cur;
  }, {});
}

/**
 * @Author: 水痕
 * @Date: 2020-03-13 16:50:44
 * @LastEditors: 水痕
 * @Description: 深度比较两个对象是否相等
 * @param {type} 
 * @return: 
 */
export const isDeepObjectEqual = (x: ObjectType, y: ObjectType): boolean => {
  // 指向同一内存时
  if (x === y) {
    return true;
  } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length != Object.keys(y).length) {
      return false;
    }
    for (const prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!isDeepObjectEqual(x[prop], y[prop]))
          return false;
      } else {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

/**
 * @Author: 水痕
 * @Date: 2020-03-28 08:42:48
 * @LastEditors: 水痕
 * @Description: 简单比较两个对象是否相等
 * @param {type} 
 * @return: 
 */
export const isObjEqual = (o1: ObjectType, o2: ObjectType): boolean => {
  const keyList1 = Object.keys(o1);
  const keyList2 = Object.keys(o2);
  if (keyList1.length != keyList2.length) {
    return false;
  }
  return keyList1.every(item => Object.is(o1[item], o2[item]));
}

/**
 * @Author: 水痕
 * @Date: 2020-03-28 13:24:27
 * @LastEditors: 水痕
 * @Description: 对象排序后转换字符串
 * @param {type} 
 * @return: 
 */
export const jsonSortStr = (obj: ObjectType): string => {
  return JSON.stringify(objectKeySort(obj));
}