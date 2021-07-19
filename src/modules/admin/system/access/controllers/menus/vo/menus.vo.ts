import { QueryVo } from '@src/vo/query.vo';
import { ApiProperty } from '@nestjs/swagger';

export class MenusListVo extends QueryVo {
  @ApiProperty({ description: '名称' })
  name: string;

  @ApiProperty({ description: '小图标' })
  icon?: string;

  @ApiProperty({ description: 'url地址' })
  url: string;

  @ApiProperty({ description: '针对操作的请求方式' })
  method?: string;

  @ApiProperty({ description: '父模块ID' })
  parentId: number;

  @ApiProperty({ description: '排序' })
  sort: number;

  @ApiProperty({ description: '描素' })
  description?: string;
}
