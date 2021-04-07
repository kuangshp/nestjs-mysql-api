import { Column, Entity, Unique } from 'typeorm';
import { PublicEntity } from '@src/modules/shared/entities/public.entity';

@Entity('access')
@Unique('module_name_delete_at', ['moduleName', 'deletedAt'])
@Unique('action_name_delete_at', ['actionName', 'deletedAt'])
export class AccessEntity extends PublicEntity {
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    name: 'module_name',
    comment: '模块名称',
  })
  moduleName: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    name: 'type',
    comment: '类型,1:表示模块,2:表示菜单,3:表示接口(API)',
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'action_name',
    comment: '操作名称',
  })
  actionName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'api_name',
    comment: '接口名称',
  })
  apiName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'icon',
    comment: '小图标',
  })
  icon: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'url',
    comment: 'url地址',
  })
  url: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 10,
    name: 'method',
    comment: '请求方式',
  })
  method: string;

  @Column({
    type: 'int',
    nullable: false,
    default: () => 0,
    name: 'parent_id',
    comment: '父模块id',
  })
  parentId: number;

  @Column({
    type: 'int',
    nullable: false,
    default: () => 1,
    name: 'sort',
    comment: '排序',
  })
  sort: number;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: () => 1,
    name: 'status',
    comment: '状态,0表示禁止,1表示正常',
  })
  status: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'description',
    comment: '描素',
  })
  description: string;
}
