import { Column, Entity, Unique } from 'typeorm';
import { SharedEntity } from '@src/modules/shared/entities/shared.entity';

@Entity('account_role')
@Unique('account_role_deleted', ['accountId', 'roleId', 'deletedAt'])
export class AccountRoleEntity extends SharedEntity {
  @Column({
    type: 'int',
    nullable: false,
    name: 'account_id',
    comment: '账号id',
  })
  accountId: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'role_id',
    comment: '角色id',
  })
  roleId: number;
}
