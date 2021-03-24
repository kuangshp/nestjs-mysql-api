import { ApiProperty } from '@nestjs/swagger';

export class RoleAccessResDto {
  @ApiProperty({ description: '主键ID' })
  id: number;

  @ApiProperty({ description: '资源ID' })
  accessId: number;
}