import { Entity, Column } from 'typeorm';

import { SharedEntity } from '@src/shared/entities/base.entity';

@Entity('login_history')
export class LoginHistoryEntity extends SharedEntity {
  @Column({
    type: 'int',
    name: 'account_id',
    comment: '关联到账号表的id',
  })
  accountId!: number;

  @Column({
    type: 'timestamp',
    name: 'last_login_time',
    default: 'CURRENT_TIMESTAMP',
    comment: '最后登录时间',
  })
  lastLoginTime!: Date;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'last_login_ip',
    nullable: true,
    comment: '最后登录ip地址',
  })
  lastLoginIp!: string;

  @Column({
    type: 'int',
    name: 'login_total',
    nullable: true,
    default: '0',
    comment: '登录次数',
  })
  loginTotal!: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'nation',
    nullable: true,
    comment: '国家',
  })
  nation!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'province',
    nullable: true,
    comment: '省份',
  })
  province!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'city',
    nullable: true,
    comment: '城市',
  })
  city!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'district',
    nullable: true,
    comment: '地区',
  })
  district!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'adcode',
    nullable: true,
    comment: '行政区划代码',
  })
  adcode!: string;
}
