import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class CreateCategoryDto extends CategoryDto {
  @ApiProperty({ required: true, description: '分类标题' })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '标题不能为空' })
  readonly title: string;
}

