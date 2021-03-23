import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString,  ValidateIf, IsOptional } from 'class-validator';
import { AccountDto } from './account.dto';

export class UpdateAccountDto extends AccountDto{
  @ApiPropertyOptional({ required: false, description: '用户名' })
  @IsString({ message: '用户名必须为字符类型' })
  @ValidateIf(o => o.username != '')
  @IsOptional()
  readonly username: string;
}