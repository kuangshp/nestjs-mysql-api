import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';

export class QueryTenantDto extends QueryOptionsDto {
  readonly name!: string; // 商户名称
  readonly status!: number; // 状态
  readonly mobile!: string; // 手机号码
  readonly username!: string; // 联系人
}
