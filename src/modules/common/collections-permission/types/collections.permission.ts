export const METHOD_METADATA = 'method';
export const PATH_METADATA = 'path';

// 请求方式
export enum RequestMethod {
  GET = 0,
  POST,
  PUT,
  DELETE,
  PATCH,
  ALL,
  OPTIONS,
  HEAD,
}
export enum IRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  ALL = 'ALL',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}
export interface IPermission {
  /** 模块名称 */
  moduleName: string;
  /** 方法名称 */
  methodName: string;
  /** 方法的请求方式 */
  method: string;
  /** url地址 */
  url: string;
}
