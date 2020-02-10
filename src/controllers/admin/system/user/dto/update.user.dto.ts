import { UserDto } from './user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto extends UserDto {
  @ApiPropertyOptional({ required: false, description: '用户名' })
  @IsString({ message: '用户名必须为字符类型' })
  @IsOptional()
  readonly username?: string;
}