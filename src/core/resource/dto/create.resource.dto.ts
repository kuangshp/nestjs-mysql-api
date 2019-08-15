import { ResourceDto } from './resource.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceDto extends ResourceDto {
  @ApiModelProperty({ description: '资源名称' })
  @IsNotEmpty({ message: '不能为空' })
  @IsString({ message: '必须是字符类型' })
  readonly name: string;
}
