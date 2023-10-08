import { QueryListVo } from '@src/shared/vo/query.list.vo';
import { QueryVo } from '@src/shared/vo/query.vo';
export class TenantVo extends QueryVo {
  readonly name!: string; // 商户名称
  readonly username!: string; // 商户联系人
  readonly mobile!: string; // 手机号码
  readonly balance!: number; // 余额
  readonly expireTime!: Date; // 过期时间
  readonly status!: number; // 状态,0表示正常,1表示禁止
  readonly provinceId!: number; // 省份id
  readonly provinceName!: string; // 省份
  readonly cityId!: number; // 市id
  readonly cityName!: string; // 市
  readonly areaId!: number; // 地区id
  readonly areaName!: string; // 地区
  readonly address!: string; // 具体地址
  readonly sort!: number; // 排序
  readonly description!: string; // 描述
  readonly accountTotal?: number; // 账号数量
}

export class TenantPageVo extends QueryListVo {
  readonly data!: TenantVo[];
}
