import { ApiProperty } from '@nestjs/swagger';
import { QueryListVo } from '@src/vo/query.list.vo';
import { QueryVo } from '@src/vo/query.vo';

export class RoleVo extends QueryVo {
  @ApiProperty({ description: '角色名称' })
  name?: string;

  @ApiProperty({ description: '角色描素' })
  description?: string;

  @ApiProperty({ description: '1表示默认角色,0表示非默认角色' })
  isDefault?: number;
}

export class RoleListVo extends QueryListVo {
  @ApiProperty({ description: '返回数据列表', type: RoleVo, isArray: true })
  data: RoleVo[];
}
