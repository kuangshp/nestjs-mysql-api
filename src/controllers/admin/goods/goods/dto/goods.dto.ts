import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GoodsDto {
  @ApiPropertyOptional({ required: false, description: '二级标题' })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly subTitle?: string;


  @ApiPropertyOptional({ required: false, description: '二级标题' })
  @IsNumber()
  @IsOptional()
  readonly marketPrice?: number;

  @ApiPropertyOptional({ required: false, description: '限够数量' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly mostNum?: number;

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


  @ApiPropertyOptional({
    required: false,
    description: '是否删除',
    enum: [0, 1],
  })
  @IsEnum({ 删除: 0, 当前可用: 1 }, { message: '必须是0或者1,0表示删除,1表示正常' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly isDelete?: number;

  @ApiPropertyOptional({
    required: false,
    description: '是否推荐',
    enum: [0, 1],
  })
  @IsEnum({ 不推荐: 0, 推荐: 1 }, { message: '必须是0或者1,0表示不推荐,1表示推荐' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly isBest?: number;

  @ApiPropertyOptional({
    required: false,
    description: '是否热销',
    enum: [0, 1],
  })
  @IsEnum({ 不热销: 0, 热销: 1 }, { message: '必须是0或者1,0表示不是热销,1表示热销' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly isHot?: number;


  @ApiPropertyOptional({
    required: false,
    description: '是否新品',
    enum: [0, 1],
  })
  @IsEnum({ 非新品: 0, 新品: 1 }, { message: '必须是0或者1,0表示不是新品,1表示新品' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly isNew?: number;

  @ApiPropertyOptional({ required: false, description: '内容' })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly content?: string;
}