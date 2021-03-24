import { ApiPropertyOptional } from '@nestjs/swagger';
import { MaxLength, IsOptional, ValidateIf, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class AccessDto {
  @ApiPropertyOptional({ required: false, description: '模块名称' })
  @MaxLength(50, { message: '长度最大为50' })
  @IsString({ message: '模块名称必须为字符串' })
  @ValidateIf(o => o.moduleName != '')
  @IsOptional()
  readonly moduleName?: string;

  @ApiPropertyOptional({ required: false, description: '操作名称(API)' })
  @IsString({ message: '操作名称必须为字符串' })
  @IsOptional()
  readonly actionName?: string;

  @ApiPropertyOptional({ required: false, description: '图标名称' })
  @IsString({ message: '图标必须为字符串' })
  @ValidateIf(o => o.icon != '')
  @IsOptional()
  readonly icon?: string;

  @ApiPropertyOptional({ required: false, description: 'url地址' })
  @IsString({ message: 'url地址必须为字符串' })
  @ValidateIf(o => o.url != '')
  @IsOptional()
  readonly url?: string;

  @ApiPropertyOptional({ required: false, description: '请求方式' })
  @IsString({ message: 'method请求方式必须是字符类型' })
  @ValidateIf(o => o.method != '')
  @IsOptional()
  readonly method?: string;

  @ApiPropertyOptional({ required: false, description: '父节点模块id' })
  @IsInt({ message: '模块父节点必须是数字' })
  @Type(() => Number)
  @ValidateIf(o => o.parentId != '')
  @IsOptional()
  readonly parentId?: number;

  @ApiPropertyOptional({ required: false, description: '排序' })
  @IsInt({ message: '排序必须是数字' })
  @Type(() => Number)
  @ValidateIf(o => o.sort != '')
  @IsOptional()
  readonly sort?: number;

  @ApiPropertyOptional({ required: false, description: '描素' })
  @MaxLength(100, { message: '描素长度最大为100' })
  @IsString({ message: '描素必须是字符类型' })
  @ValidateIf(o => o.description != '')
  @IsOptional()
  readonly description?: string;
}