import { IsInt, IsNotEmpty, IsArray, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleResourcesDto {
  @IsInt({ message: '角色ID必须为整数' })
  @IsNotEmpty({ message: '角色ID不能为空' })
  readonly roleId!: number;

  @Type(() => Number)
  // @ArrayMinSize(1, { message: '资源至少一个' })
  @IsArray({ message: '资源ID列表必须是一个数组' })
  readonly resourceList!: number[];

  @Max(1, { message: '类型id最大值为1' })
  @Min(0, { message: '类型id最小值为0' })
  @IsInt({ message: '类型id必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '类型,0表示菜单1表示按钮' })
  type!: number;
}
