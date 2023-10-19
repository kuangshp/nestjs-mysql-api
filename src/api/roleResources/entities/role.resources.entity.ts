import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('role_resources')
export class RoleResourcesEntity extends SharedEntity {
  @Index()
  @Column({
    type: 'int',
    name: 'resources_id',
    comment: '关联到resources表主键id',
  })
  resourcesId!: number;

  @Column({
    type: 'int',
    name: 'role_id',
    comment: '关联到role表主键id',
  })
  roleId!: number;

  @Column({
    type: 'tinyint',
    name: 'type',
    default: '0',
    comment: '类型,0表示菜单1表示按钮',
  })
  type!: number;
}
