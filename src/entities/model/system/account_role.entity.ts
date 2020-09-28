import { Column, Entity } from 'typeorm';
import { PublicEntity } from '../public.entity';


@Entity('account_role')
export class AccountRoleEntity extends PublicEntity {

	@Column('int', {
		nullable: false,
		name: 'account_id',
		comment: '用户id'
	})
	accountId: number;


	@Column('int', {
		nullable: false,
		name: 'role_id',
		comment: '角色id'
	})
	roleId: number;

}
