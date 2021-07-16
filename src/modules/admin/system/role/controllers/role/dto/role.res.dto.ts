import { ApiProperty } from '@nestjs/swagger';
import { QueryResDto } from '@src/dto/query.res.dto';
import { QueryListVo } from '@src/dto/query.list.res.dto';

export class RoleResDto extends QueryResDto {
  @ApiProperty({ description: '角色名称' })
  name?: string;

  @ApiProperty({ description: '角色描素' })
  description?: string;

  @ApiProperty({ description: '1表示默认角色,0表示非默认角色' })
  isDefault?: number;
}

export class RoleListResDtoDto extends QueryListVo<RoleResDto> {
  constructor(pageSize: number, pageNumber: number, data: RoleResDto[]) {
    super(pageSize, pageNumber, data);
  }
}
