import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';


@Entity('order_info')
export class OrderInfoEntity {

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;


  @Column('varchar', {
    nullable: false,
    default: () => 1,
    name: 'person_num',
    comment: '用餐人数',
  })
  personNum: string;


  @Column('varchar', {
    nullable: false,
    name: 'table_id',
    comment: '点餐桌子号',
  })
  tableId: string;


  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'remark',
    comment: '备注信息',
  })
  remark: string | null;


  @Column('enum', {
    nullable: true,
    default: () => '1',
    enum: ['0', '1'],
    name: 'status',
    comment: '订单状态,0表示完成,1表示进行中'
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
