import { Type } from 'class-transformer';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, MaxLength, Min } from 'class-validator';

export class DepartmentDto {
  @MaxLength(50, { message: '部门名称最大长度为50' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  title!: string;

  @Min(1, { message: '部门负责人最小值为1' })
  @IsInt({ message: '部门负责人必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '部门负责人' })
  accountId!: number;

  @IsOptional({ message: '联系手机号码' })
  mobile!: string;

  @IsEmail({}, { message: '电邮地址错误' })
  @IsOptional({ message: '电邮地址' })
  email!: string;

  @MaxLength(255, { message: '描述最大长度为255' })
  @IsOptional({ message: '描述' })
  description!: string;

  @Min(1, { message: '排序最小值为1' })
  @IsInt({ message: '排序必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '排序' })
  sort!: number;

  @IsInt({ message: '自己关联主键id必须是整数' })
  @Type(() => Number)
  parentId!: number;
}
