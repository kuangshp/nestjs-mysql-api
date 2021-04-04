import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsUserName } from '@src/validators';

export class LoginDto {
  @ApiProperty({ required: true, description: '用户名' })
  @IsUserName()
  @IsString({ message: '用户名必须为字符类型' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty({ required: true, description: '密码' })
  @IsString({ message: '密码必须为字符串类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
