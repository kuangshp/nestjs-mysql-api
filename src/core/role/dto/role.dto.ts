import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoleDto {
  @ApiModelProperty({ required: true, description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不为空' })
  name: string;
}
