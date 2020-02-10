import {
  IsNotEmpty,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AccessDto } from './access.dto';

export class CreateAccessDto extends AccessDto {

  @ApiProperty({ required: true, description: '节点类型, 表示模块顶级模块: 1, 表示菜单: 2, 操作: 3', enum: [1, 2, 3] })
  @IsEnum({ 表示模块顶级模块: 1, 表示菜单: 2, 操作: 3 }, { message: '必须是1、2、3其中一个' })
  @IsInt({ message: '节点类型必须是整数' })
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '节点类型不能为空' })
  readonly type: string;
}
