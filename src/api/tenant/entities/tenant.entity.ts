import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('tenant')
export class TenantEntity extends SharedEntity {
  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    name: 'name',
    comment: '商户名称',
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'username',
    nullable: true,
    comment: '商户联系人',
  })
  username!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'mobile',
    nullable: true,
    comment: '手机号码',
  })
  mobile!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'balance',
    nullable: true,
    default: '0.00',
    comment: '余额',
  })
  balance!: number;

  @Column({
    type: 'datetime',
    name: 'expire_time',
    comment: '过期时间',
  })
  expireTime!: Date;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '0',
    comment: '状态,0表示正常,1表示禁止',
  })
  status!: number;

  @Column({
    type: 'int',
    name: 'province_id',
    nullable: true,
    comment: '省份id',
  })
  provinceId!: number;

  @Column({
    type: 'int',
    name: 'city_id',
    nullable: true,
    comment: '市id',
  })
  cityId!: number;

  @Column({
    type: 'int',
    name: 'area_id',
    nullable: true,
    comment: '地区id',
  })
  areaId!: number;

  @Column({
    type: 'varchar',
    length: 200,
    name: 'address',
    nullable: true,
    comment: '具体地址',
  })
  address!: string;

  @Column({
    type: 'int',
    name: 'sort',
    nullable: true,
    default: '1',
    comment: '排序',
  })
  sort!: number;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'description',
    nullable: true,
    comment: '描述',
  })
  description!: string;
}
