import {
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AccessDto } from './access.dto';

export class UpdateAccessDto extends AccessDto {

  @ApiPropertyOptional({ required: false, description: '节点类型', enum: [1, 2, 3] })
  @IsEnum({ 表示模块顶级模块: 1, 表示菜单: 2, 操作: 3 }, { message: '必须是1、2、3其中一个' })
  @IsInt({ message: '节点类型必须是整数' })
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly type?: string;
}
