import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryOptionsDto {
  @ApiPropertyOptional({ required: false, description: '一页显示多少条' })
  pageSize?: number;

  @ApiPropertyOptional({ required: false, description: '当前页' })
  pageNumber?: number;
}
