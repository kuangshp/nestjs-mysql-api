import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('menus')
export class MenusEntity extends SharedEntity {
  @Column({
    type: 'varchar',
    length: 50,
    name: 'name',
    comment: '菜单名称',
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'icon',
    nullable: true,
    comment: '小图标',
  })
  icon!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'url',
    nullable: true,
    comment: 'url地址',
  })
  url!: string;

  @Column({
    type: 'tinyint',
    name: 'is_link',
    nullable: true,
    default: '1',
    comment: '是否为外部连接,0表示是,1表示不是',
  })
  isLink!: number;

  @Column({
    type: 'int',
    name: 'parent_id',
    default: '0',
    comment: '父菜单id',
  })
  parentId!: number;

  @Column({
    type: 'int',
    name: 'sort',
    default: '1',
    comment: '排序',
  })
  sort!: number;
}
