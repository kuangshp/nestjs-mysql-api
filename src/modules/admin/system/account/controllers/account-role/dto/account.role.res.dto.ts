import { ApiProperty } from '@nestjs/swagger';

export class AccountRoleListResDto {
  @ApiProperty({ required: true, description: '账号ID' })
  accountId?: number;

  @ApiProperty({ required: true, description: '角色ID' })
  roleId?: number;
}