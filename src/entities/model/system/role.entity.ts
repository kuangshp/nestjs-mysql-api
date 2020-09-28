import { Column, Entity } from 'typeorm';
import { PublicEntity } from '../public.entity';


@Entity('role')
export class RoleEntity extends PublicEntity {

	@Column('varchar', {
		nullable: false,
		length: 50,
		name: 'title',
		comment: '角色名称'
	})
	title: string;


	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'description',
		comment: '角色描素'
	})
	description: string | null;

}
