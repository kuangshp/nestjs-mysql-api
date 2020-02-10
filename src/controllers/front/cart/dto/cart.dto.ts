import {
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CartDto {
  @ApiPropertyOptional({
    required: false,
    description: '状态',
    enum: [0, 1],
    default: 1,
  })
  @IsEnum({ 完成: 0, 进行中: 1 }, { message: '购物车状态,0表示完成,1表示进行中' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly status?: number;
}