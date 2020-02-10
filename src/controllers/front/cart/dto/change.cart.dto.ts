import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { CartDto } from './cart.dto';

export class ChangeCartDto extends CartDto {
  @ApiProperty({
    required: true,
    description: '操作',
    enum: [0, 1],
  })
  @IsEnum({ 减少: 0, 增加: 1 }, { message: '操作,0表示减少,1表示增加' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '操作类型不能为空' })
  readonly type: number;

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
