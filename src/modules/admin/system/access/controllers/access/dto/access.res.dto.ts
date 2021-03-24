import { QueryResDto } from '@src/dto/query.res.dto';
import { QueryListResDto } from '@src/dto/query.list.res.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AccessResDto extends QueryResDto {
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

export class AccessListResDtoDto extends QueryListResDto<AccessResDto>{
  constructor (pageSize: number, pageNumber: number, data: AccessResDto[]) {
    super(pageSize, pageNumber, data);
  }
}