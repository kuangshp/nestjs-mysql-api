import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';

export class QueryDepartmentDto extends QueryOptionsDto {
  readonly status!: number; // 状态
  readonly title!: number; // 部门名称
  readonly tenantId!: number; // 商户id
}
