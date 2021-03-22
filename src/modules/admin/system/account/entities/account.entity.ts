import { Entity, Column, Unique, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude } from 'class-transformer';
import NodeAuth from 'simp-node-auth';

import { PublicEntity } from '@src/modules/shared/entities/public.entity';

@Entity('account')
@Unique('username_mobile_email_unique', ['username', 'mobile', 'email'])
export class AccountEntity extends PublicEntity {
  @Exclude()
  private nodeAuth: NodeAuth;
  constructor () {
    super();
    this.nodeAuth = new NodeAuth();
  }

  // 唯一索引
  @Index({ unique: true })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'username',
    comment: '用户名'
  })
  username: string

  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
    name: 'password',
    select: false,
    comment: '密码'
  })
  password: string;

  @Index({ unique: true })
  @Column( {
    type: 'varchar',
    nullable: true,
    length: 11,
    name: 'mobile',
    comment: '手机号码'
  })
  mobile: string | null;

  @Index({ unique: true })
  @Column( {
    type: 'varchar',
    nullable: true,
    length: 50,
    name: 'email',
    comment: '邮箱'
  })
  email: string | null;

  @Column({
    type: 'tinyint', 
    nullable: true,
    default: () => 1,
    name: 'status',
    comment: '状态,0表示禁止,1表示正常'
  })
  status: number | null;

  @Column({
    type: 'int', 
    nullable: true,
    name: 'platform',
    default: () => 1,
    comment: '平台:1为主办方,2为运营管理'
  })
  platform: number;

  @Column({
    type: 'tinyint', 
    nullable: false,
    default: () => 0,
    name: 'is_super',
    comment: '是否为超级管理员1表示是,0表示不是'
  })
  isSuper: number;

  @Column({
    type: 'varchar', 
    nullable: true,
    length: 60,
    name: 'last_login_ip',
    comment: '最后登录id'
  })
  lastLoginIp: string | null;

  @Column( {
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_login_time',
    comment: '最后登录时间'
  })
  lastLoginTime: Date;

  @BeforeInsert()
  @BeforeUpdate()
  makePassword() {
    if (this.password) {
      this.password = this.nodeAuth.makePassword(this.password);
    }
  }
}