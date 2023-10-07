import { QueryListVo } from '@src/shared/vo/query.list.vo';
import { QueryVo } from '@src/shared/vo/query.vo';

export class AccountVo extends QueryVo {
  readonly username!: string; // 账号
  readonly accountType!: number; // 账号类型:0普通账号,1是主账号,2是超管
  readonly tenantId!: number; // 关联到tenant表主键id
  readonly tenantName!: string; // 关联到tenant表名称
  readonly parentId!: number; // 自关联主键id
  readonly parentName!: number; // 自关联主键id
  readonly sort!: number; // 排序
  readonly status!: number; // 状态0是正常,1是禁用
  readonly lastLoginIp!: string; // 最后登录ip地址
  readonly lastLoginNation!: string; // 最后登录国家
  readonly lastLoginProvince!: string; // 最后登录省份
  readonly lastLoginCity!: string; // 最后登录城市
  readonly lastLoginDistrict!: string; // 最后登录地区
  readonly lastLoginAdcode!: string; // 最后登录行政区划代码
  readonly lastLoginDate!: Date; // 最后登录时间
}

export class AccountPageVo extends QueryListVo {
  readonly data!: AccountVo[];
}
