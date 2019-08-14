import { RoleDto } from './role.dto';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateRoleDto extends RoleDto {
  @ApiModelProperty({ required: false, description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不为空' })
  @IsOptional()
  name?: string;
}
