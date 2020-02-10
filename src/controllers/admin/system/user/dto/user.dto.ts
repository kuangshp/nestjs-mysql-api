import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsMobilePhone,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Expose, Exclude } from 'class-transformer';

export class UserDto {
  @ApiPropertyOptional({ required: false, description: '邮箱' })
  @IsEmail({ allow_display_name: true }, { message: '邮箱格式错误' })
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({ required: false, description: '手机号码' })
  @IsMobilePhone('zh-CN', { message: '手机号码格式错误' })
  @IsOptional()
  readonly mobile?: string;

  @ApiPropertyOptional({
    required: false,
    description: '状态',
    enum: [0, 1],
  })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '必须是0或者1' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly status?: number;

  @ApiPropertyOptional({
    required: false,
    description: '平台',
  })
  @IsOptional()
  readonly platform?: string;

  @ApiPropertyOptional({
    required: false,
    description: '是否为超级管理员',
    enum: [0, 1],
  })
  
  @IsEnum({ 普通用户: 0, 超级管理员: 1 }, { message: '必须是0或者1' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly is_super?: number;
}
