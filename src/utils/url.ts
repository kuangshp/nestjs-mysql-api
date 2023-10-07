import { URL } from 'url';
/**
 * @Author: 水痕
 * @Date: 2021-07-16 16:47:27
 * @LastEditors: 水痕
 * @Description: 根据key从一段url中获取query值
 * @param urlPath {String} url地址
 * @param key {String} 获取单独的一个key
 * @return {*}
 */
export const getUrlQuery = (urlPath: string, key: string): string | null => {
  const url = new URL(urlPath, 'https://www.');
  const params = new URLSearchParams(url.search.substring(1));
  return params.get(key);
};
