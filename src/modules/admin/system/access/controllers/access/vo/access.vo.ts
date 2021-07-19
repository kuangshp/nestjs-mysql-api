import { QueryVo } from '@src/vo/query.vo';
import { QueryListVo } from '@src/vo/query.list.vo';
import { ApiProperty } from '@nestjs/swagger';

export class AccessVo extends QueryVo {
  @ApiProperty({ description: '模块名称' })
  moduleName: string;

  @ApiProperty({ description: '操作名称' })
  actionName: string;

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

export class AccessListVo extends QueryListVo {
  @ApiProperty({ description: '返回数据列表', type: AccessVo, isArray: true })
  data: AccessVo[];
}
