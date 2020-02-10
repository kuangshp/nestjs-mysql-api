import {
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GoodsDto } from './goods.dto';
import { Transform } from 'class-transformer';

export class UpdateGoodsDto extends GoodsDto {
  @ApiPropertyOptional({ required: false, description: '分类标题' })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;

  @ApiPropertyOptional({ required: false, description: '主图地址' })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '图片地址不能为空' })
  readonly goodsImg: string;


  @ApiPropertyOptional({ required: false, description: '销售价格' })
  @IsNumber()
  @IsNotEmpty({ message: '价格不能为空' })
  readonly shopPrice: number;


  @ApiPropertyOptional({ required: false, description: '商品数量' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '数量不能为空' })
  readonly count: number;

  @ApiPropertyOptional({ required: false, description: '商品分类id' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '商品分类id不能为空' })
  readonly categoryId: number;
}

