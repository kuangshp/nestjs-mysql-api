import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { RoleDto } from './role.dto';

export class CreateRoleDto extends RoleDto{
  @ApiProperty({ required: true, description: '角色名称' })
  @IsString({ message: '角色名称必须为字符类型' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  readonly name: string;
}