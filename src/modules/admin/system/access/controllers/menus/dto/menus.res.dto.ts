import { QueryResDto } from '@src/dto/query.res.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MenusListResDto extends QueryResDto{
  @ApiProperty({ description: '模块名' })
  moduleName: string;

  @ApiProperty({ description: '类型(1模块,2菜单,3操作API)' })
  type: number;

  @ApiProperty({ description: '操作名' })
  actionName: string;

  @ApiProperty({ description: '小图标' })
  icon?: string;

  @ApiProperty({ description: 'url地址' })
  url: string;

  @ApiProperty({ description: '针对操作的请求方式' })
  method: string;

  @ApiProperty({ description: '父模块ID' })
  moduleId: number;

  @ApiProperty({ description: '排序' })
  sort: number;

  @ApiProperty({ description: '描素' })
  description: string;
}