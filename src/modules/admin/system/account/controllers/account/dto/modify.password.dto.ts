import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEqual } from '@src/validators';

export class ModifyPasswordDto {
  @ApiProperty({ required: true, description: '旧密码' })
  @IsString({ message: '旧密码必须为字符类型' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  readonly password: string;

  @ApiProperty({ required: true, description: '新密码' })
  @IsString({ message: '新密码必须为字符类型' })
  @IsNotEmpty({ message: '新密码不能为空' })
  readonly newPassword: string;

  @ApiProperty({ required: true, description: '再次输入新密码' })
  @IsEqual('newPassword', {message: '两次密码不一致'})
  @IsString({ message: '再次输入新密码必须为字符类型' })
  @IsNotEmpty({ message: '再次输入新密码不能为空' })
  readonly repPassword: string;
}