import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from "typeorm";


@Entity("goods_category")
export class GoodsCategoryEntity {

	@PrimaryGeneratedColumn({
		type: "int",
		name: "id",
		comment: "主键id"
	})
	id: number;

	@Column("varchar", {
		nullable: false,
		unique: true,
		length: 100,
		name: "title",
		comment: "分类标题"
	})
	title: string;


	@Column("varchar", {
		nullable: true,
		length: 200,
		name: "description",
		comment: "分类介绍",
	})
	description: string | null;

	@Column("int", {
		nullable: false,
		default: () => 1,
		name: "sort",
		comment: "排序",
	})
	sort: number;

	@Column("tinyint", {
		nullable: true,
		default: () => "'1'",
		name: "status",
		comment: "状态"
	})
	status: number | null;


	@Column("timestamp", {
		nullable: false,
		default: () => "CURRENT_TIMESTAMP",
		name: "created_at",
		comment: "创建时间",
	})
	createdAt: Date;


	@Column("timestamp", {
		nullable: false,
		default: () => "CURRENT_TIMESTAMP",
		name: "updated_at",
		comment: "更新时间",
	})
	updatedAt: Date;

}
