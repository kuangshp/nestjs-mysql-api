import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryOptionsDto {
  @ApiPropertyOptional({ required: false, description: '一页显示多少条' })
  @IsOptional()
  readonly pageSize?: number;

  @ApiPropertyOptional({ required: false, description: '当前页' })
  @IsOptional()
  readonly pageNumber?: number;
}
