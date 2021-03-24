import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, ValidateIf, ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleAccessReqDto {
  @ApiProperty({ required: true, description: '角色ID' })
  @IsInt({ message: '角色ID必须是整数' })
  @Type(() => Number)
  @ValidateIf(o => o.roleId != '')
  @IsNotEmpty({message: '角色ID不能为空'})
  roleId: number;

  @ApiProperty({required: true, description: '资源ID数组'})
  @ValidateNested({
    each: true, // 对数组中每一项进行校验
  })
  @Type(() => Number)
  @ArrayMinSize(1, { message: '菜单资源至少一个' })
  @IsArray({ message: '资源ID列表必须是一个数组' })
  accessList: number[];
}