import { StatusEnum } from '@src/enums';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Max, MaxLength, Min } from 'class-validator';

export class RoleDto {
  @MaxLength(50, { message: '角色名称长度最大为50' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  name!: string;

  @MaxLength(100, { message: '角色描素长度最大为50' })
  @IsOptional({ message: '角色描素' })
  description!: string;

  @Max(1, { message: '状态最大值为1' })
  @Min(0, { message: '状态最小值为0' })
  @IsInt({ message: '状态必须是数字' })
  @Type(() => Number)
  @IsNotEmpty({ message: '状态不能为空' })
  status!: StatusEnum;

  @Max(1, { message: '是否为默认角色最大值为1' })
  @Min(0, { message: '是否为默认角色最小值为0' })
  @IsInt({ message: '是否为默认角色必须是数字' })
  @Type(() => Number)
  @IsOptional({ message: '是否为默认角色' })
  isDefault!: number;
}
