import { MaxLength, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RoleDto {

  @ApiPropertyOptional({ required: false, description: '角色描素' })
  @MaxLength(100, { message: '长度最大为100' })
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({
    required: false,
    description: '选中的权限,以英文,拼接传递',
  })
  @IsString({ message: '选中的权限必须的字符类型' })
  @IsOptional()
  readonly accessIdsList?: string;
}