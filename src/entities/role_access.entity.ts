import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('role_access')
export class RoleAccessEntity {
	@PrimaryGeneratedColumn({
		type: "int",
		name: "id"
	})
	id: number;

	@Column("int", {
		nullable: true,
		name: "role_id"
	})
	roleId: number | null;


	@Column("int", {
		nullable: true,
		name: "access_id"
	})
	accessId: number | null;

	@Column("varchar", {
		nullable: true,
		name: "type",
		comment: '1表示菜单2表示接口'
	})
	type: number | null;


	@Column("timestamp", {
		nullable: false,
		default: () => "CURRENT_TIMESTAMP",
		name: "created_at"
	})
	createdAt: Date;


	@Column("timestamp", {
		nullable: false,
		default: () => "CURRENT_TIMESTAMP",
		name: "updated_at"
	})
	updatedAt: Date;
}
