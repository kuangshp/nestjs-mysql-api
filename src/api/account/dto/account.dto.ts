import { IsEqual } from '@src/validators';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsMobilePhone,
  IsOptional,
  IsEmail,
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
