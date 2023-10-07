import { SharedEntity } from '@src/shared/entities/base.entity';
import { Transform, TransformFnParams } from 'class-transformer';
import { Entity, Column, Index } from 'typeorm';

@Entity('account')
export class AccountEntity extends SharedEntity {
  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    name: 'username',
    nullable: true,
    comment: '账号',
  })
  username!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'password',
    comment: '密码',
  })
  password!: string;

  @Column({
    type: 'tinyint',
    name: 'account_type',
    nullable: true,
    default: '0',
    comment: '账号类型:0普通账号,1是主账号,2是超管',
  })
  accountType!: number;

  @Column({
    type: 'int',
    name: 'tenant_id',
    comment: '关联到tenant表主键id',
  })
  tenantId!: number;

  @Column({
    type: 'int',
    name: 'parent_id',
    nullable: true,
    default: '-1',
    comment: '自关联主键id',
  })
  parentId!: number;

  @Column({
    type: 'int',
    name: 'sort',
    nullable: true,
    default: '1',
    comment: '排序',
  })
  sort!: number;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '0',
    comment: '状态0是正常,1是禁用',
  })
  status!: number;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'last_login_ip',
    nullable: true,
    comment: '最后登录ip地址',
  })
  lastLoginIp!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'last_login_nation',
    nullable: true,
    comment: '最后登录国家',
  })
  lastLoginNation!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'last_login_province',
    nullable: true,
    comment: '最后登录省份',
  })
  lastLoginProvince!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'last_login_city',
    nullable: true,
    comment: '最后登录城市',
  })
  lastLoginCity!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'last_login_district',
    nullable: true,
    comment: '最后登录地区',
  })
  lastLoginDistrict!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'last_login_adcode',
    nullable: true,
    comment: '最后登录行政区划代码',
  })
  lastLoginAdcode!: string;

  @Transform((row: TransformFnParams) => +new Date(row.value))
  @Column({
    type: 'timestamp',
    name: 'last_login_date',
    nullable: true,
    comment: '最后登录时间',
  })
  lastLoginDate!: Date;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'salt',
    nullable: true,
    comment: '密码盐',
  })
  salt!: string;
}
