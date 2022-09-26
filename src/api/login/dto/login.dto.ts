import { IsString, IsNotEmpty } from 'class-validator';
import { IsUserName } from '@src/validators';

export class LoginDto {
  @IsUserName()
  @IsString({ message: '用户名必须为字符类型' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username!: string;

  @IsString({ message: '密码必须为字符串类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password!: string;
}
