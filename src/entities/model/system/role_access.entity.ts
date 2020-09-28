import { Column, Entity } from 'typeorm';
import { PublicEntity } from '../public.entity';


@Entity('role_access')
export class RoleAccessEntity extends PublicEntity {

	@Column('int', {
		nullable: true,
		name: 'role_id',
		comment: '角色id'
	})
	roleId: number;


	@Column('int', {
		nullable: true,
		name: 'access_id',
		comment: '资源id'
	})
	accessId: number;

}
