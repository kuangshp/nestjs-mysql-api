import { ApiProperty } from '@nestjs/swagger';

export class AllApiVo {
  @ApiProperty({ description: '主键ID' })
  id: number;

  @ApiProperty({ description: 'API名称' })
  apiName: string;
}
