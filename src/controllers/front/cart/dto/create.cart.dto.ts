import {
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CartDto } from './cart.dto';

export class CreateCartDto extends CartDto {
  @ApiProperty({
    required: true,
    description: '桌子号',
  })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '不能为空' })
  readonly tableId: string;

  @ApiProperty({ required: true, description: '关联的商品id' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '商品id不能为空' })
  readonly goodsId: number;

  @ApiProperty({ required: true, description: '下单的商品数量' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '数量不能为空' })
  readonly num: number;
} 
