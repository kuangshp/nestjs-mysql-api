import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, ValidateIf, IsOptional } from 'class-validator';
import { RoleDto } from './role.dto';

export class UpdateRoleDto extends RoleDto {
  @ApiPropertyOptional({ required: false, description: '角色名称' })
  @IsString({ message: '角色名称必须为字符类型' })
  @ValidateIf(o => o.name != '')
  @IsOptional()
  readonly name: string;
}