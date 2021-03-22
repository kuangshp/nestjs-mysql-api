/** 定义返回错误的code */
export enum CodeEnum {
  /** 没传递token */
  NO_TOKEN = 10042,
  /** token错误 */
  TOKEN_ERROR = 10043,

}

/** 错误的code文字描素 */
export const CodeMessage = {
  10042: '你还没登录,请先登录',
  10043: '传递的token错误',
};
