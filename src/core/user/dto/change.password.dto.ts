import { IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiModelProperty({ description: '旧密码' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  readonly password: string;

  @ApiModelProperty({ description: '新密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly newPassword: string;

  @ApiModelProperty({ description: '重复密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly repPassword: string;
}
