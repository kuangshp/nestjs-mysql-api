import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMobilePhone,
  ValidateIf,
  IsOptional,
  IsEnum,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RoleDto {
  @ApiPropertyOptional({ required: false, description: '手机号码' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号码格式错误' })
  @ValidateIf((o) => o.mobile != '')
  @IsOptional()
  readonly mobile?: string;

  @ApiPropertyOptional({ required: false, description: '描素' })
  @MaxLength(100, { message: '描素最长字符为100' })
  @IsString({ message: '描素必须是字符类型' })
  @ValidateIf((o) => o.description != '')
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ required: false, description: '状态', enum: [0, 1] })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '状态必须是(0:表示禁止,1:表示正常)的数字' })
  @Type(() => Number)
  @ValidateIf((o) => o.status != '')
  @IsOptional()
  readonly status?: number;

  @ApiPropertyOptional({ required: false, description: '是否为默认角色', enum: [0, 1] })
  @IsEnum({ 不开通: 0, 开通: 1 }, { message: '平台必须是(1表示开通,0表示不开通)的数字' })
  @Type(() => Number)
  @ValidateIf((o) => o.isDefault != '')
  @IsOptional()
  readonly isDefault?: number;
}
