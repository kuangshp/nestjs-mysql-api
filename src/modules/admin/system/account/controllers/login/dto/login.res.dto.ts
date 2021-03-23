import { ApiProperty } from '@nestjs/swagger';
import { QueryResDto } from '@src/dto/query.res.dto';

export class LoginResDto extends QueryResDto{

  @ApiProperty({ description: '账号绑定的手机号码' })
  mobile?: string;

  @ApiProperty({ description: '账号绑定的邮箱' })
  email?: string;

  @ApiProperty({ description: '用户名' })
  username?: string;

  @ApiProperty({ description: '状态：0表示禁止,1表示正常' })
  status?: number;

  @ApiProperty({ description: '平台：0:表示普通人员(没权限)，1表示为运营管理,2表示入住商家' })
  platform?: number;

  @ApiProperty({ description: '是否为超级管理员：1表示是,0表示不是' })
  isSuper?: number;

  @ApiProperty({ description: '登录的token' })
  token?: string;
}