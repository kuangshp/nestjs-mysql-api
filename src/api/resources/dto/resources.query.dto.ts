import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';

export class QueryResourcesDto extends QueryOptionsDto {
  readonly title!: string; // 接口标题,或菜单标题
  readonly type!: number; // 0目录,1菜单,2接口
  readonly parentId!: number; // 上一级id
  readonly status!: number; // 状态:0是正常,1是禁止
  readonly isBtn!: number; // 是否为按钮:0表示不是,1表示是
}
