import { CreateUserDto } from './create.user.dto';
import { Exclude } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  // @Exclude()
  // @ApiModelProperty({ required: false, description: '用户名' })
  // @IsOptional()
  // readonly name?: string;
  // @Exclude()
  // @ApiModelProperty({ required: false, description: '密码' })
  // @IsOptional()
  // readonly password?: string;
}
