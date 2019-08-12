import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsMobilePhone,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Transform, Expose, Exclude } from 'class-transformer';
import { UserExtendDto } from './user.extend.dto';

export class UserDto extends UserExtendDto {
  @ApiModelProperty({ required: false, description: '邮箱' })
  @IsEmail({ allow_display_name: true }, { message: '邮箱格式错误' })
  @IsOptional()
  readonly email?: string;

  @ApiModelProperty({ required: false, description: '手机号码' })
  @IsMobilePhone('zh-CN', { message: '手机号码格式错误' })
  @IsOptional()
  readonly mobile?: string;

  @ApiModelProperty({
    required: false,
    description: '是否可用',
    enum: [0, 1],
  })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '必须是0或者1' })
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly isActive?: number;

  @ApiModelProperty({
    required: false,
    description: '性别',
    enum: [0, 1],
    default: 1,
  })
  @IsEnum({ 女: 0, 男: 1 }, { message: '必须是0或者1' })
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly gender?: number;
}
