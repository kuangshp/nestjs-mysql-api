// :0普通账号,1是主账号,2是超管
/** 账号类型枚举 */
export enum AccountTypeEnum {
  /** 普通账号 */
  NORMAL_ACCOUNT = 0,
  /** 主账号 */
  PRIMARY_ACCOUNT = 1,
  /** 超管 */
  SUPER_ACCOUNT = 2,
}

/** 状态描素 */
export const AccountTypeMessage = {
  0: '普通账号',
  1: '主账号',
  2: '超管',
};
