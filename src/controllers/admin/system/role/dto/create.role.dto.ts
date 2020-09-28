import { MaxLength, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

export class CreateRoleDto extends RoleDto {
  @ApiProperty({ required: true, description: '角色标题' })
  @MaxLength(50, { message: '长度最大为50' })
  @IsString({ message: '密码必须为字符串类型' })
  @IsNotEmpty({ message: '角色不能为空' })
  readonly title: string;
}