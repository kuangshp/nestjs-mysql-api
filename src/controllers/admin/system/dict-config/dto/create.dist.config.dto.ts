import { DistConfigDto } from './dist.config.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDistConfigDto extends DistConfigDto {

  @ApiPropertyOptional({
    required: true,
    description: 'label值',
  })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly label: string;

  @ApiPropertyOptional({
    required: true,
    description: '分类',
  })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly category: string;
}