import {
  IsString,
  IsOptional,
  IsEmail,
  IsMobilePhone,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiModelProperty({ required: false, description: '姓名' })
  @IsString({ message: '姓名必须要是字符' })
  @IsOptional()
  name?: string;

  @ApiModelProperty({ required: false, description: '手机号码' })
  @IsMobilePhone('zh-CN', { message: '手机号码格式错误' })
  @IsOptional()
  mobile?: string;

  @ApiModelProperty({ required: false, description: '邮箱' })
  @IsEmail({ allow_display_name: true }, { message: '邮箱格式错误' })
  @IsOptional()
  email?: string;

  @ApiModelProperty({
    required: false,
    description: '是否可用',
    enum: [0, 1],
  })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '必须是0或者1' })
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  isActive?: number;

  @ApiModelProperty({
    required: false,
    description: '性别',
    enum: [0, 1],
    default: 1,
  })
  @IsEnum({ 女: 0, 男: 1 }, { message: '必须是0或者1' })
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  gender?: number;
}
