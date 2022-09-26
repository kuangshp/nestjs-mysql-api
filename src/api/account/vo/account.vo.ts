import { QueryListVo } from '@src/shared/vo/query.list.vo';
import { QueryVo } from '@src/shared/vo/query.vo';
export class LoginHistoryVo {
  readonly loginTime!: Date; // 最后登录时间
  readonly loginIp!: string; // 最后登录ip
  readonly loginTotal!: number; // 登录次数
  readonly nation!: string; // 国家
  readonly province!: string; // 省份
  readonly city!: string; // 城市
  readonly district!: string; // 地区
  readonly adcode!: string; // 行政区划代码
}
export class AccountVo extends QueryVo {
  readonly username!: string; // 用户名
  readonly mobile!: string; // 手机号码
  readonly status!: number; // 状态0表示禁用，1表示可用
  readonly isSuper!: number; // 是否为超级管理员1表示是,0表示不是
}

export class AccountListVo extends QueryListVo {
  readonly data!: AccountVo[];
}
