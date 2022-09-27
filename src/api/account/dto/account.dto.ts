import { IsEqual } from '@src/validators';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsMobilePhone,
  IsOptional,
  IsEmail,
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  IsNumber,
  IsInt,
  Max,
  Min,
} from 'class-validator';

export class CreateAccountDto {
  @IsString({ message: '用户名必须是字符类型' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username!: string;

  @MinLength(6, { message: '密码最小成为为6位' })
  @IsString({ message: '密码必须是字符类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password!: string;

  @IsMobilePhone('zh-CN', {}, { message: '手机号码格式错误' })
  @IsString({ message: '密码必须是字符类型' })
  @IsOptional()
  readonly mobile!: string;

  @IsEmail({ message: '邮箱格式错误' })
  @IsString({ message: '邮箱必须是字符类型' })
  @IsOptional()
  readonly email!: string;

  @IsEqual('password')
  @IsString({ message: '确认密码必须为字符类' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  readonly confirmPassword!: string;
}

export class IdListDto {
  @IsArray()
  @IsNumber(undefined, { each: true, message: '必须是数字' })
  @ArrayUnique({ message: '不能重复字段' })
  @ArrayMinSize(1, { message: '最小长度为1' })
  @IsNotEmpty({ message: 'id列表不能为空' })
  readonly idList!: number[];
}

export class StatusDto {
  @IsArray()
  @IsNumber(undefined, { each: true, message: '必须是数字' })
  @ArrayUnique({ message: '不能重复字段' })
  @ArrayMinSize(1, { message: '最小长度为1' })
  @IsNotEmpty({ message: 'id列表不能为空' })
  readonly idList!: number[];

  @Max(1, { message: '状态最大值为1' })
  @Min(0, { message: '状态最小值为0' })
  @IsInt({ message: '状态必须是数字' })
  @Type(() => Number)
  @IsNotEmpty({ message: '状态不能为空' })
  readonly status!: number;
}
