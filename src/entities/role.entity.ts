import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';


@Entity('role')
export class RoleEntity {
	@PrimaryGeneratedColumn({
		type: 'int',
		name: 'id',
		comment: '主键id',
	})
	id: number;

	@Column('varchar', {
		nullable: false,
		primary: true,
		length: 50,
		name: 'uuid',
		generated: 'uuid',
		comment: 'uuid',
	})
	uuid: string;

	@Column('varchar', {
		nullable: false,
		unique: true,
		length: 50,
		name: 'title',
		comment: '角色名称',
	})
	title: string;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'description',
		comment: '描素',
	})
	description: string | null;

	@Column('tinyint', {
		nullable: true,
		default: () => 1,
		name: 'status',
		comment: '状态',
	})
	status: number | null;

	@Column('timestamp', {
		nullable: false,
		default: () => 'CURRENT_TIMESTAMP',
		name: 'created_at',
		comment: '创建时间',
	})
	createdAt: Date;

	@Column('timestamp', {
		nullable: false,
		default: () => 'CURRENT_TIMESTAMP',
		name: 'updated_at',
		comment: '最后更新时间',
	})
	updatedAt: Date;
}
