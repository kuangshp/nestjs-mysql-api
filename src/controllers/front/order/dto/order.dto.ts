import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class OrderDto {
  @ApiPropertyOptional({ required: false, description: '备注信息' })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly remark?: string;

  @ApiPropertyOptional({
    required: false,
    description: '商品类型:-1表示退货,0表示补单,1表示下单',
    default: 1,
  })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  goodsType?: number;

  @ApiPropertyOptional({
    required: false,
    description: '状态',
    enum: [0, 1],
  })
  @IsEnum({ 完成: 0, 进行中: 1 }, { message: '订单状态,0表示完成,1表示进行中' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly status?: number;
}