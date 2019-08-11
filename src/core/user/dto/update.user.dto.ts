import { CreateUserDto } from './create.user.dto';
import { Exclude, Expose } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

@Exclude()
export class UpdateUserDto extends CreateUserDto {
  @ApiModelProperty({ required: true, description: '用户名' })
  // @IsString({ message: '用户名必须为字符类型' })
  // @IsNotEmpty({ message: '姓名不能为空' })
  @Expose({ groups: ['user.name'] })
  name: string;

  @ApiModelProperty({ required: true, description: '密码' })
  // @IsString({ message: '密码必须为字符串类型' })
  // @IsNotEmpty({ message: '密码不能为空' })
  @Expose({ groups: ['user.password'] })
  password: string;
}
