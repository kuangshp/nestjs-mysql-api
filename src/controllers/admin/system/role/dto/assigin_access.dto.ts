import { IsNotEmpty, IsInt, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AssiginAccessDto {
  @ApiProperty({ required: true, description: '角色id' })
  @IsInt({ message: '角色id必须为整数' })
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '角色id不能为空' })
  readonly roleId: number;

  @ApiProperty({ required: true, description: '资源列表' })
  @IsArray({ message: '资源id列表' })
  @IsNotEmpty({ message: '资源id不能为空' })
  readonly accessList: number[]
}