import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleAccessReqDto {
  // @ApiProperty({ required: true, description: '角色ID' })
  // @IsInt({ message: '角色ID必须是整数' })
  // @Type(() => Number)
  // @ValidateIf((o) => o.roleId != '')
  // @IsNotEmpty({ message: '角色ID不能为空' })
  // roleId: number;

  @ApiProperty({ required: true, description: '资源ID数组' })
  @Type(() => Number)
  // @ArrayMinSize(1, { message: '菜单资源至少一个' })
  @IsArray({ message: '资源ID列表必须是一个数组' })
  accessList: number[];

  @ApiProperty({ required: true, description: '类型(2为菜单,3为接口)', enum: [2, 3] })
  @IsEnum({ 菜单: 2, 接口: 3 }, { message: '类型必须是(2:表示菜单,3:表示接口)的数字' })
  @Type(() => Number)
  @ValidateIf((o) => o.type != '')
  @IsNotEmpty({ message: '类型不能为空' })
  type: number;
}
