import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsValidationName } from './../../../shared/decorators/name.validation';

export class LoginUserDto {
  @ApiModelProperty({ description: '用户名' })
  @IsValidationName()
  readonly name: string;

  @ApiModelProperty({ description: '密码' })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;
}
