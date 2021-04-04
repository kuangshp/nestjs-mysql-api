import { QueryOptionsDto } from '@src/dto/query.options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class AccessReqDto extends QueryOptionsDto {
  @ApiPropertyOptional({ required: false, description: '父节点ID' })
  @IsOptional()
  parentId?: number;
}
