import { MethodEnum } from '@src/enums/method.enum';
import { IsIncludes } from '@src/validators';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, Max, MaxLength, Min } from 'class-validator';

export class ResourcesDto {
  @MaxLength(50, { message: '标题长度最大长度为50' })
  @IsNotEmpty({ message: '接口标题,或菜单标题不能为空' })
  title!: string;

  @MaxLength(100, { message: '接口请求url,或菜单路由最大长度为100' })
  @IsNotEmpty({ message: '接口请求url,或菜单路由不能为空' })
  url!: string;

  @IsIncludes([
    MethodEnum.GET,
    MethodEnum.POST,
    MethodEnum.DELETE,
    MethodEnum.PUT,
    MethodEnum.PATCH,
  ])
  @IsOptional({ message: '接口的请求方式' })
  method!: MethodEnum;

  @MaxLength(100, { message: '菜单小图标最大长度为100' })
  @IsOptional({ message: '菜单小图标' })
  icon!: string;

  @Min(1, { message: '菜单,或接口排序最小值为0' })
  @IsInt({ message: '菜单,或接口排序必须是数字' })
  @Type(() => Number)
  sort!: number;

  @Max(2, { message: '0目录,1菜单,2接口' })
  @Min(0, { message: '0目录,1菜单,2接口' })
  @IsInt({ message: '类型必须是数字' })
  @Type(() => Number)
  @IsNotEmpty({ message: '类型不能为空' })
  resourcesType!: number;

  @IsInt({ message: '上一级id' })
  @Type(() => Number)
  @IsOptional({ message: '父级' })
  parentId!: number;
}
