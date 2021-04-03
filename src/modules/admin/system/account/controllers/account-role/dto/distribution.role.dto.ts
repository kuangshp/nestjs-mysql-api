import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class DistributionRoleDto {
  @ApiProperty({ required: true, description: '账号ID' })
  @IsInt({ message: '账号ID必须为整数' })
  @IsNotEmpty({ message: '账号ID不能为空' })
  readonly accountId: number;

  @ApiProperty({ required: true, description: '角色ID列表' })
  // @ValidateNested({
  //   each: true, // 对数组中每一项进行校验
  // })
  @Type(() => Number)
  @ArrayMinSize(1, { message: '角色至少一个' })
  @IsArray({ message: '角色ID列表必须是一个数组' })
  readonly roleList: number[];
}
