import { Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';


@Entity('cart')
export class CartEntity {

	@PrimaryGeneratedColumn({
		type: 'int',
		name: 'id',
		comment: '主键id',
	})
	id: number;


	@Column('varchar', {
		nullable: false,
		name: 'table_id',
		comment: '点餐桌子号',
	})
	tableId: string;


	@Column('int', {
		nullable: true,
		name: 'goods_id',
		comment: '关联商品id',
	})
	goodsId: number | null;


	@Column('int', {
		nullable: false,
		default: () => 1,
		name: 'num',
		comment: '商品数量',
	})
	num: number;


	@Column('enum', {
		nullable: true,
		default: () => '1',
		enum: ['0', '1'],
		name: 'status',
		comment: '购物车状态,0表示完成,1表示进行中',
	})
	status: string | null;


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
