import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';
/*
1、模块名称: 模块名称就是左侧的主菜单名称，如果增加数据的时候是模块，那么需要指定节点类型是模块，并且选择所属模块为顶级模块
2、节点类型： 1、表示模块   2、表示菜单     3、操作
3、操作名称:如果节点类型是菜单，那么操作名称就是左侧菜单的名称。如果节点类型是操作，那么操作名称就是具体的操作名称
4、操作地址：用户实际访问的地址
5、所属模块：模块（顶级模块）  菜单和操作（父亲模块）
*/

@Entity('access')
export class AccessEntity {
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
		nullable: true,
		unique: true,
		length: 50,
		name: 'module_name', //模块名称
		comment: '模块名称'
	})
	moduleName: string | null;


	@Column('enum', {
		nullable: true,
		enum: ['1', '2', '3'],//节点类型 :  1、表示模块顶级模块   2、表示菜单     3、操作
		name: 'type',
		comment: '类型'
	})
	type: string | null;


	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'action_name',//操作名称根据上面type来变化的
		comment: '操作名称'
	})
	actionName: string | null;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'icon',
		comment: '图标'
	})
	icon: string | null;


	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'url',
		comment: 'url地址'
	})
	url: string | null;

	@Column('varchar', {
		nullable: true,
		length: 100,
		name: 'method',
		comment: '接口请求方式'
	})
	method: string | null;


	@Column('int', {
		nullable: false,
		default: () => -1,
		name: 'module_id', //此module_id和当前模型的_id关联     module_id= 0 表示模块
		comment: '模块id'
	})
	moduleId: number;


	@Column('int', {
		nullable: false,
		default: () => 1,
		name: 'sort',
		comment: '排序'
	})
	sort: number;


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
