import { QueryListVo } from '@src/shared/vo/query.list.vo';
import { QueryVo } from '@src/shared/vo/query.vo';

export class DepartmentVo extends QueryVo {
  readonly title!: string; // 部门名称
  readonly name!: string; // 部门负责人
  readonly mobile!: string; // 联系手机号码
  readonly email!: string; // 电邮地址
  readonly description!: string; // 描述
  readonly status!: number; // 状态0是正常,1是禁用
  readonly sort!: number; // 排序
  readonly tenantId!: number; // 关联到tenant表主键id
  readonly tenantName!: string; // 关联到tenant表主键id
  readonly parentId!: number | string; // 自己关联主键id
  readonly parentTitle!: string; // 自己关联主键id
}

export class DepartmentPageVo extends QueryListVo {
  readonly data!: DepartmentVo[];
}

export class SimplenessDepartmentVo {
  readonly id!: number; // 部门id
  readonly title!: string; // 部门名称
  readonly parentId!: number; // 自己关联主键id
}
