import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from "typeorm";


@Entity("goods")
export class GoodsEntity {

	@PrimaryGeneratedColumn({
		type: "int",
		name: "id",
		comment: "主键id",
	})
	id: number;

	@Column('varchar', {
		nullable: false,
		primary: true,
		generated: 'uuid',
		length: 50,
		name: 'uuid',
		comment: 'uuid',
	})
	uuid: string;

	@Column("varchar", {
		nullable: false,
		unique: true,
		length: 100,
		name: "title",
		comment: "商品标题",
	})
	title: string;


	@Column("varchar", {
		nullable: true,
		length: 100,
		name: "sub_title",
		comment: "附标题",
	})
	subTitle: string | null;


	@Column("varchar", {
		nullable: true,
		length: 200,
		name: "goods_img",
		comment: "主图",
	})
	goodsImg: string | null;


	@Column("double", {
		nullable: false,
		default: () => "'0'",
		name: "shop_price",
		comment: "商品价格",
	})
	shopPrice: number;


	@Column("float", {
		nullable: true,
		name: "market_price",
		comment: "市场价格",
	})
	marketPrice: number | null;


	@Column("int", {
		nullable: false,
		default: () => "'0'",
		name: "count",
		comment: "商品数量",
	})
	count: number;

	@Column("int", {
		nullable: false,
		default: () => 100,
		name: "most_num",
		comment: "限购数量",
	})
	mostNum: number;


	@Column("int", {
		nullable: false,
		default: () => 1,
		name: "sort",
		comment: "排序",
	})
	sort: number;


	@Column("enum", {
		nullable: false,
		default: () => 1,
		enum: ["0", "1"],
		name: "is_delete",
		comment: "是否删除",
	})
	isDelete: string;


	@Column("enum", {
		nullable: false,
		default: () => 0,
		enum: ["0", "1"],
		name: "is_best",
		comment: "是否推荐",
	})
	isBest: string;


	@Column("enum", {
		nullable: false,
		default: () => 0,
		enum: ["0", "1"],
		name: "is_hot",
		comment: "热销"
	})
	isHot: string;


	@Column("enum", {
		nullable: false,
		default: () => 0,
		enum: ["0", "1"],
		name: "is_new",
		comment: "新品",
	})
	isNew: string;


	@Column("text", {
		nullable: false,
		name: "content",
		comment: "商品内容",
	})
	content: string | null;


	@Column("tinyint", {
		nullable: true,
		default: () => 1,
		name: "status",
		comment: "状态"
	})
	status: number | null;


	@Column("int", {
		nullable: false,
		name: "category_id",
		comment: "商品分类id",
	})
	categoryId: number;


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
