import { ApiProperty } from '@nestjs/swagger';

export class QueryResDto {

  @ApiProperty({ description: '主键id' })
  id?: number;

  @ApiProperty({ description: '创建时间' })
  createdAt?: Date;

  @ApiProperty({ description: '更新时间' })
  updatedAt?: Date;
}