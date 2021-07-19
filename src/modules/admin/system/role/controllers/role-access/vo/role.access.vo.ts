import { ApiProperty } from '@nestjs/swagger';

export class RoleAccessVo {
  @ApiProperty({ description: '主键ID' })
  id: number;

  @ApiProperty({ description: '资源ID' })
  accessId: number;
}
