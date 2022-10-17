import { StatusEnum } from '@src/enums';
import { QueryListVo } from '@src/shared/vo/query.list.vo';
import { QueryVo } from '@src/shared/vo/query.vo';

export class RoleVo extends QueryVo {
  readonly name!: string; // 角色名称
  readonly description!: string; // 角色描素
  readonly status!: StatusEnum; // 状态1表示正常,0表示不正常
  readonly isDefault!: number; // 针对后期提供注册用,1表示默认角色,0表示非默认角色
}

export class RolePageVo extends QueryListVo {
  readonly data!: RoleVo[];
}

export class RoleListVo {
  readonly id!: number; // 角色名称
  readonly name!: string; // 角色名称
}
