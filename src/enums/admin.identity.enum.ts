/** 后台管理账号身份枚举类型 */
export enum AdminIdentityEnum {
  /** 普通账号 */
  NORMAL = 0,
  /** 超级管理员 */
  SUPPER = 1,
}

/** 后台管理账号身份描素 */
export const AdminIdentityMessage = {
  0: '普通账号',
  1: '超级管理员'
};
