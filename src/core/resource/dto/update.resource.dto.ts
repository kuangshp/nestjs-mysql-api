import { ResourceDto } from './resource.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateResourceDto extends ResourceDto {
  @ApiModelProperty({ description: '资源名称' })
  @IsNotEmpty({ message: '不能为空' })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly name?: string;
}
