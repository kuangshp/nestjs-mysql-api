import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('department')
export class DepartmentEntity extends SharedEntity {
  @Column({
    type: 'varchar',
    length: 50,
    name: 'title',
    comment: '部门名称',
  })
  title!: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    name: 'name',
    nullable: true,
    comment: '部门负责人',
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'mobile',
    nullable: true,
    comment: '联系手机号码',
  })
  mobile!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'email',
    nullable: true,
    comment: '电邮地址',
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'description',
    nullable: true,
    comment: '描述',
  })
  description!: string;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '0',
    comment: '状态0是正常,1是禁用',
  })
  status!: number;

  @Column({
    type: 'int',
    name: 'sort',
    nullable: true,
    default: '1',
    comment: '排序',
  })
  sort!: number;

  @Column({
    type: 'int',
    name: 'tenant_id',
    nullable: true,
    default: '-1',
    comment: '关联到tenant表主键id',
  })
  tenantId!: number;

  @Column({
    type: 'int',
    name: 'parent_id',
    nullable: true,
    default: -1,
    comment: '自己关联主键id',
  })
  parentId!: number;
}
