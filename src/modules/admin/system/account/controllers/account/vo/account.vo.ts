import { ApiProperty } from '@nestjs/swagger';
import { QueryListVo } from '@src/vo/query.list.vo';
import { QueryVo } from '@src/vo/query.vo';

export class AccountVo extends QueryVo {
  @ApiProperty({ description: '用户名' })
  username?: string;

  @ApiProperty({ description: '邮箱' })
  email?: string;

  @ApiProperty({ description: '手机号码' })
  mobile?: string;

  @ApiProperty({ description: '状态,0表示禁止,1表示正常' })
  status?: number;

  @ApiProperty({ description: '平台:0表示普通用户(没权限),1表示为运营管理,2表示入住商家' })
  platform?: number;
}
export class AccountListVo extends QueryListVo {
  @ApiProperty({ description: '返回数据列表', type: AccountVo, isArray: true })
  data: AccountVo[];
}
