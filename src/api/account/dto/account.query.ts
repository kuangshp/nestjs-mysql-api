import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';

export class QueryAccountDto extends QueryOptionsDto {
  readonly status!: number; // 状态
  readonly tenantId!: number; // 商户id
  readonly username!: string; // 联系人
}
