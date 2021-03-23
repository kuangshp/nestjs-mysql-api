import { ApiProperty } from '@nestjs/swagger';
import { QueryResDto } from '@src/dto/query.res.dto';
import { QueryListResDto } from '@src/dto/query.list.res.dto';

export class AccountResDto extends QueryResDto{
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


export class AccountListResDtoDto extends QueryListResDto<AccountResDto>{
  constructor (pageSize: number, pageNumber: number, data: AccountResDto[]) {
    super(pageSize, pageNumber, data);
  }
}

