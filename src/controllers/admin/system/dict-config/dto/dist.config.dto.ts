import {
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DistConfigDto {

  @ApiPropertyOptional({
    required: false,
    description: '描述',
  })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly description?: string;
}

