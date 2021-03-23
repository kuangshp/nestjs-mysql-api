import { Column, Entity, Unique } from 'typeorm';
import { PublicEntity } from '@src/modules/shared/entities/public.entity';

@Entity('account_role')
@Unique('account_role_deleted', ['accountId', 'roleId', 'deletedAt'])
export class AccountRoleEntity extends PublicEntity {
  @Column({
    type: 'int',
    nullable: false,
    name: 'account_id',
    comment: '账号id'
  })
  accountId: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'role_id',
    comment: '角色id'
  })
  roleId: number;
}
