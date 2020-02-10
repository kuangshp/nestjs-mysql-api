import {
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { GoodsListDto } from './goods.list.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto extends OrderDto {
  @ApiProperty({ required: true, description: '用餐人数' })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '用餐人数不能为空' })
  readonly personNum: string;

  @ApiProperty({
    required: true,
    description: '桌子号',
  })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '不能为空' })
  readonly tableId: string;

  @ApiProperty({
    required: true,
    type: [GoodsListDto],
    description: '商品信息',
  })
  @ValidateNested({
    each: true, // 对数组中每一项进行校验
  })
  @Type(() => GoodsListDto)
  readonly goodsList: GoodsListDto[]
} 