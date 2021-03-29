import { ApiProperty } from '@nestjs/swagger';

export class QueryListResDto<T> {
  @ApiProperty({ description: '列表数据', isArray: true })
  data: T[];

  @ApiProperty({ description: '总页数' })
  total: number;

  @ApiProperty({ description: '页码' })
  pageSize: number;

  @ApiProperty({ description: '当前页' })
  pageNumber: number;

  constructor(pageSize: number, pageNumber: number, data: T[]) {
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    this.data = data;
  }
}
