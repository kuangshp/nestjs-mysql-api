import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ResourceDto {
  @ApiModelProperty({ required: false, description: '当前是否可用' })
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: '不是数字' })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '必须是0或者1' })
  @Transform(val => parseInt(val, 10))
  @IsOptional()
  isActive: number;

  @ApiModelProperty({ required: false, description: '描素' })
  @IsString({ message: '必须是字符串类型' })
  @IsOptional()
  description?: string;

  @ApiModelProperty({ required: false, description: '父资源id' })
  @IsNumber({ allowInfinity: false, allowNaN: false }, { message: '不是数字' })
  @Transform(val => parseInt(val, 10))
  @IsOptional()
  parentId?: number;
}
