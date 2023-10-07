import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, MaxLength, Min } from 'class-validator';

export class AccountDto {
  @MaxLength(50, { message: '账号最大长度为50' })
  @IsNotEmpty({ message: '账号不能为空' })
  username!: string;

  @Min(1, { message: '排序最小值为1' })
  @IsInt({ message: '排序必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '排序' })
  sort!: number;
}
