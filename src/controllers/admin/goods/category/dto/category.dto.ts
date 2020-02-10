import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CategoryDto {
  @ApiPropertyOptional({ required: false, description: '分类介绍' })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ required: false, description: '必须是数字' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly sort?: string;

  @ApiPropertyOptional({
    required: false,
    description: '状态',
    enum: [0, 1],
  })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '必须是0或者1' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly status?: number;
}

