import { IsDateFormateString } from '@src/validators';
import { Type } from 'class-transformer';
import { IsInt, IsMobilePhone, IsNotEmpty, IsOptional, MaxLength, Min } from 'class-validator';

export class TenantDto {
  @MaxLength(50, { message: '商户名称最大长度50' })
  @IsNotEmpty({ message: '商户名称不能为空' })
  name!: string;

  @MaxLength(50, { message: '商户联系人最大长度50' })
  @IsOptional({ message: '商户联系人' })
  username!: string;

  @IsMobilePhone('zh-CN', { strictMode: false }, { message: '手机号码格式错误' })
  @IsOptional({ message: '手机号码' })
  mobile!: string;

  @IsDateFormateString()
  @IsNotEmpty({ message: '过期时间不能为空' })
  expireTime!: Date;

  @Min(1, { message: '省份最小值为1' })
  @IsInt({ message: '省份必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '省份id' })
  provinceId!: number;

  @Min(1, { message: '市最小值为1' })
  @IsInt({ message: '市必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '市id' })
  cityId!: number;

  @Min(1, { message: '地区最小值为1' })
  @IsInt({ message: '地区必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '地区id' })
  areaId!: number;

  @IsOptional({ message: '地址' })
  address!: string;

  @Min(1, { message: '排序最小值为1' })
  @IsInt({ message: '排序必须是整数' })
  @Type(() => Number)
  @IsOptional({ message: '排序' })
  sort!: number;

  @MaxLength(255, { message: '描述最大长度为255' })
  @IsOptional({ message: '描述' })
  description!: string;
}
