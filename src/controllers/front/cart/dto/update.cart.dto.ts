import {
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CartDto } from './cart.dto';

export class UpdateCartDto extends CartDto {
  @ApiPropertyOptional({
    required: true,
    description: '桌子号',
  })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly tableId?: string;

  @ApiPropertyOptional({ required: true, description: '关联的商品id' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly goodsId?: number;

  @ApiPropertyOptional({ required: true, description: '下单的商品数量' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly num?: number;
} 
