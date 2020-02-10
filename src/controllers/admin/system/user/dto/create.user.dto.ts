import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto extends UserDto {
  @ApiProperty({ required: true, description: '用户名' })
  @IsString({ message: '用户名必须为字符类型' })
  @IsNotEmpty({ message: '姓名不能为空' })
  readonly username: string;

  @ApiProperty({ required: true, description: '密码' })
  @IsString({ message: '密码必须为字符串类型' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}