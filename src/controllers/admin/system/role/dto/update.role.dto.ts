import { MaxLength, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class UpdateRoleDto extends RoleDto {
  @ApiPropertyOptional({ required: true, description: '角色标题' })
  @MaxLength(50, { message: '长度最大为50' })
  @IsString({ message: '密码必须为字符串类型' })
  @IsOptional()
  readonly title?: string;
}