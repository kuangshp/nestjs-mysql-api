import * as url from 'url';

/**
 * @Author: 水痕
 * @Date: 2020-01-23 12:01:38
 * @LastEditors: 水痕
 * @Description: 根据key从一段url中获取query值
 * @param urlPath {String} url地址
 * @param key {String} 获取单独的一个key
 * @return: 
 */
export const getUrlQuery = (urlPath: string, key?: string): string | object => {
  const query = url.parse(urlPath, true).query
  if (key) {
    return query[key]
  } else {
    return query;
  }
};
