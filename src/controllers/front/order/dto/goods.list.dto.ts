import {
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GoodsListDto {
  @ApiProperty({ required: true, description: '关联的商品id' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '商品id不能为空' })
  readonly goodsId: number;

  @ApiProperty({ required: true, description: '关联商品的标题' })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '商品id不能为空' })
  readonly title: string;

  @ApiProperty({ required: true, description: '关联商品的价格' })
  @IsNumber()
  @IsNotEmpty({ message: '商品价格不能为空' })
  readonly shopPrice: number;

  @ApiProperty({ required: true, description: '下单的商品数量' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '数量不能为空' })
  readonly num: number;
}