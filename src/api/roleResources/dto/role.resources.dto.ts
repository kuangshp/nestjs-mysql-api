import { IsInt, IsNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleResourcesDto {
  @IsInt({ message: '角色ID必须为整数' })
  @IsNotEmpty({ message: '角色ID不能为空' })
  readonly roleId!: number;

  @Type(() => Number)
  // @ArrayMinSize(1, { message: '资源至少一个' })
  @IsArray({ message: '资源ID列表必须是一个数组' })
  readonly resourceList!: number[];
}
