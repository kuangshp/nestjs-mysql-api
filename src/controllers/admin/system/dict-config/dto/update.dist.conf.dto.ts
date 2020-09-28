import { DistConfigDto } from './dist.config.dto';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDistConfigDto extends DistConfigDto {
  @ApiProperty({
    required: true,
    description: 'label值',
  })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '不能为空' })
  readonly label: string;

  @ApiProperty({
    required: true,
    description: '分类',
  })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '不能为空' })
  readonly category: string;
}