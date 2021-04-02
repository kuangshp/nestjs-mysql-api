import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMobilePhone, ValidateIf, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountDto {
  @ApiPropertyOptional({ required: false, description: '手机号码' })
  @IsMobilePhone('zh-CN', {}, { message: '手机号码格式错误' })
  @ValidateIf((o) => o.mobile != '')
  @IsOptional()
  readonly mobile?: string;

  @ApiPropertyOptional({ required: false, description: '手机号码' })
  @IsEmail({}, { message: '邮箱格式错误' })
  @ValidateIf((o) => o.email != '')
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({ required: false, description: '状态', enum: [0, 1] })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '状态必须是(0:表示禁止,1:表示正常)的数字' })
  @Type(() => Number)
  @ValidateIf((o) => o.status != '')
  @IsOptional()
  readonly status?: number;

  @ApiPropertyOptional({ required: false, description: '平台', enum: [0, 1, 2] })
  @IsEnum({ 普通用户: 0, 运营管理: 1, 商家入驻: 2 }, { message: '平台必须是(0表示普通用户(没权限),1表示为运营管理,2表示入住商家)的数字' })
  @Type(() => Number)
  @ValidateIf((o) => o.platform != '')
  @IsOptional()
  readonly platform?: number;
}
