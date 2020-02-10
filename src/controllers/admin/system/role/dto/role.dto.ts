import { MaxLength, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RoleDto {

  @ApiPropertyOptional({ required: false, description: '角色描素' })
  @MaxLength(100, { message: '长度最大为100' })
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({
    required: false,
    description: '状态',
    enum: [0, 1],
  })
  @IsEnum({ 禁用: 0, 当前可用: 1 }, { message: '必须是0或者1' })
  @IsNumber()
  @Transform(value => parseInt(value, 10))
  @IsOptional()
  readonly status?: number;
}