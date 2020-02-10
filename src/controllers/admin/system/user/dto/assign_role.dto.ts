import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class AssiginRoleDto {
  @ApiProperty({ required: true, description: '用户id' })
  @IsInt({ message: '用户id必须为整数' })
  @Transform(value => parseInt(value, 10))
  @IsNotEmpty({ message: '用户id不能为空' })
  readonly userId: number;

  @ApiProperty({ required: true, description: '角色id列表' })
  @IsArray({ message: '角色id列表' })
  readonly roleList: number[]
}