import { AccessDto } from './access.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAccessDto extends AccessDto {
  @ApiPropertyOptional({ required: false,  description: '节点类型, 表示模块顶级模块: 1, 表示菜单: 2, 操作(API): 3', enum: [1, 2, 3] })
  @IsEnum({ 模块: 1, 菜单: 2, 操作: 3 }, { message: '资源类型必须是1、2、3其中一个' })
  @IsInt({ message: '节点类型必须是整数' })
  @Type(() => Number)
  @ValidateIf(o => o.moduleName != '')
  @IsOptional()
  readonly type: string;
}