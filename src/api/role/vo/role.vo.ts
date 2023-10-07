import { QueryListVo } from '@src/shared/vo/query.list.vo';
import { QueryVo } from '@src/shared/vo/query.vo';
export class RoleVo extends QueryVo {
  readonly name!: string; // 角色名称
  readonly description!: string; // 描述
  readonly status!: number; // 状态0是正常,1是禁用
  readonly sort!: number; // 排序
  readonly tenantId!: number; // 关联到tenant表主键id
  readonly tenantName!: string; // 关联到tenant表主键id
  readonly accountId!: number; // 关联account主键id
  readonly accountUsername!: string; // 关联account主键id
}

export class RolePageVo extends QueryListVo {
  readonly data!: RoleVo[];
}
