import { QueryListVo } from '@src/shared/vo/query.list.vo';
import { QueryVo } from '@src/shared/vo/query.vo';

export class ResourcesVo extends QueryVo {
  readonly title!: string; // 接口标题,或菜单标题
  readonly url!: string; // 接口请求url,或菜单路由
  readonly icon!: string; // 菜单小图标
  readonly sort!: number; // 菜单,或接口排序
  readonly resourcesType!: number; // 0目录,1菜单,2接口
  readonly parentId!: number; // 上一级id
  readonly status!: number; // 状态:0是正常,1是禁止
  readonly hasChildren?: boolean; // 是否有子节点
}

export class ResourcesListVo extends QueryListVo {
  readonly data!: ResourcesVo[];
}

export class SimplenessResourceVo {
  readonly id!: number;
  readonly title!: string;
  readonly parentId!: number;
  readonly resourcesType!: number;
}
