import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, Min } from 'class-validator';

export class AccountRoleDto {
  @Min(1, { message: '账号id最小值为1' })
  @IsInt({ message: '账号id必须是整数' })
  @Type(() => Number)
  @IsNotEmpty({ message: '账号id不能为空' })
  accountId!: number;

  @Type(() => Number)
  // @ArrayMinSize(1, { message: '角色至少一个' })
  @IsArray({ message: '角色ID列表必须是一个数组' })
  readonly roleList!: number[];
}
