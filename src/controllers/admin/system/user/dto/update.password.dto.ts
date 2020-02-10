import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ required: true, description: '新密码' })
  @IsString({ message: '新密码必须为字符串类型' })
  @IsNotEmpty({ message: '新密码不能为空' })
  readonly password: string;

  @ApiProperty({ required: true, description: '确认密码' })
  @IsString({ message: '确认密码必须为字符串类型' })
  @IsNotEmpty({ message: '确认密码不能为空' })
  readonly checkPassword: string;

  @ApiProperty({ required: true, description: '老密码' })
  @IsString({ message: '老密码必须为字符串类型' })
  @IsNotEmpty({ message: '老密码不能为空' })
  readonly oldPassword: string;
}