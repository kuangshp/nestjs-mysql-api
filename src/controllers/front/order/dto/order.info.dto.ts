import {
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class OrderInfoDto {
  @ApiProperty({ required: true, description: '用餐人数' })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '用餐人数不能为空' })
  readonly personNum: string;

  @ApiProperty({
    required: true,
    description: '桌子号',
  })
  @IsString({ message: '必须是字符类型' })
  @IsNotEmpty({ message: '不能为空' })
  readonly tableId: string;

  @ApiPropertyOptional({ required: false, description: '备注信息' })
  @IsString({ message: '必须是字符类型' })
  @IsOptional()
  readonly remark?: string;
}