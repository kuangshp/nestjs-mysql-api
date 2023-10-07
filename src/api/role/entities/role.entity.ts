import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('role')
export class RoleEntity extends SharedEntity {
  @Column({
    type: 'varchar',
    length: 50,
    name: 'name',
    comment: '角色名称',
  })
  name!: string;

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
    name: 'account_id',
    nullable: true,
    default: '-1',
    comment: '关联account主键id',
  })
  accountId!: number;
}
