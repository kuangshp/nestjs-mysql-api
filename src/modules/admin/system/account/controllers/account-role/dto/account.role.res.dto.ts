import { ApiProperty } from '@nestjs/swagger';

export class AccountRoleListResDto {
  @ApiProperty({ required: true, description: '账号ID' })
  accountId?: number;

  @ApiProperty({ required: true, description: '角色ID' })
  roleId?: number;
}

export class RoleAccountListDto {
  @ApiProperty({ required: true, description: '角色ID' })
  id: number;

  @ApiProperty({ required: true, description: '角色名称' })
  name: string;
}
