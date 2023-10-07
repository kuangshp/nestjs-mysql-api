import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';

export class QueryRoleDto extends QueryOptionsDto {
  readonly name!: string; // 名称
  readonly status!: number; // 状态
}
