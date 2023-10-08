import { IsString, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsString({ message: '用户名必须为字符类型' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username!: string;

  @IsString({ message: '密码必须为字符串类型' })
  @Length(6, 12, { message: '密码长度必须是6-12位的' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password!: string;

  @IsNotEmpty({ message: '验证码不能空' })
  readonly captcha!: string;
}
