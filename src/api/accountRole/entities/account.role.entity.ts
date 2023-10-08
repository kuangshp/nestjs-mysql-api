import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('account_role')
export class AccountRoleEntity extends SharedEntity {
  @Index()
  @Column({
    type: 'int',
    name: 'account_id',
    comment: '关联到account表主键id',
  })
  accountId!: number;

  @Column({
    type: 'int',
    name: 'role_id',
    comment: '关联到role表主键id',
  })
  roleId!: number;
}
