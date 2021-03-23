/** 平台枚举类型 */
export enum PlatformEnum {
  /** 普通人员(没任何权限) */
  NO_AUTH = 0,
  /** 运营人员平台 */
  ADMIN_PLATFORM = 1,
  /** 入住商家平台 */
  MERCHANT_PLATFORM = 2,
  
}

/** 平台文字描素 */
export const PlatformMessage = {
  0: '普通人员',
  1: '运营管理平台',
  2: '入住商家平台',
};
