import { MethodEnum } from '@src/enums/method.enum';
import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('resources')
export class ResourcesEntity extends SharedEntity {
  @Column({
    type: 'varchar',
    length: 50,
    name: 'title',
    comment: '按钮标题,或菜单标题',
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'url',
    comment: '按钮请求url,或菜单路由',
  })
  url!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'method',
    nullable: true,
    comment: '接口的请求方式',
  })
  method!: MethodEnum;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'icon',
    nullable: true,
    comment: '菜单小图标',
  })
  icon!: string;

  @Column({
    type: 'tinyint',
    name: 'resources_type',
    nullable: true,
    default: '0',
    comment: '0目录,1菜单,2接口',
  })
  resourcesType!: number;

  @Column({
    type: 'tinyint',
    name: 'type',
    nullable: true,
    default: '0',
    comment: '是否为模块:0,菜单:1,按钮(接口):2',
  })
  type!: number;

  @Column({
    type: 'int',
    name: 'parent_id',
    default: '-1',
    comment: '上一级id',
  })
  parentId!: number;

  @Column({
    type: 'int',
    name: 'sort',
    nullable: true,
    default: '1',
    comment: '菜单,或按钮排序',
  })
  sort!: number;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '0',
    comment: '状态0是正常,1是禁用',
  })
  status!: number;

  @Column({
    type: 'varchar',
    length: 200,
    name: 'description',
    nullable: true,
    comment: '描述',
  })
  description!: string;
}
