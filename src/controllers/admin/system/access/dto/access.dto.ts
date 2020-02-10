import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AccessDto {

  @ApiPropertyOptional({ required: false, description: '模块名称' })
  @MaxLength(50, { message: '长度最大为50' })
  @IsOptional()
  readonly moduleName?: string;

  @ApiPropertyOptional({ required: false, description: '操作名称' })
  @IsString({ message: '操作名称必须为字符串' })
  @IsOptional()
  readonly actionName?: string;

  @ApiPropertyOptional({ required: false, description: '图标名称' })
  @IsString({ message: '图标必须为字符串' })
  @IsOptional()
  readonly icon?: string;

  @ApiPropertyOptional({ required: false, description: 'url地址' })
  // @IsUrl({ message: 'url地址错误' })
  @IsString({ message: 'url地址必须为字符串' })
  @IsOptional()
  readonly url?: string;

  @ApiPropertyOptional({ required: false, description: '请求方式' })
  @IsString({ message: 'method请求方式必须是字符类型' })
  @IsOptional()
  readonly method?: string;


  @ApiPropertyOptional({ required: false, description: '父节点模块id' })
  @IsInt({ message: '模块父节点必须是数字' })
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly moduleId?: number;

  @ApiPropertyOptional({ required: false, description: '平台名称' })
  @IsString({ message: '平台必须为字符串类型' })
  @IsOptional()
  readonly platform?: string;

  @ApiPropertyOptional({ required: false, description: '排序' })
  @IsInt({ message: '排序必须是数字' })
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly sort?: number;

  @ApiPropertyOptional({ required: false, description: '描素' })
  @IsString({ message: '描素必须是字符类型' })
  @IsOptional()
  readonly description?: string;

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