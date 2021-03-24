import { AccessDto } from './access.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccessDto extends AccessDto{
  @ApiProperty({ required: true, description: '节点类型, 表示模块顶级模块: 1, 表示菜单: 2, 操作(API): 3', enum: [1, 2, 3] })
  @IsEnum({ 模块: 1, 菜单: 2, 操作: 3 }, { message: '资源类型必须是1、2、3其中一个' })
  @IsInt({ message: '节点类型必须是整数' })
  @Type(() => Number)
  @IsNotEmpty({ message: '节点类型不能为空' })
  readonly type: string;
}