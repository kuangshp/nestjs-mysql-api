import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RoleDto {
  @ApiModelProperty({ required: true, description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不为空' })
  name: string;

  @ApiModelProperty({ required: true, description: '是否可用', enum: [0, 1] })
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: '不是数字' })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '必须是0或者1' })
  @Transform(val => parseInt(val, 10))
  @IsOptional()
  isActive?: number;

  @ApiModelProperty({ required: false, description: '描素' })
  @IsString({ message: '必须是字符串类型' })
  @IsOptional()
  description: string;
}
