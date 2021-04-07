import { Entity, Column, Unique, Index, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import { Exclude } from 'class-transformer';
import NodeAuth from 'simp-node-auth';
import { isMobilePhone, isEmail } from 'class-validator';

import { PublicEntity } from '@src/modules/shared/entities/public.entity';
import { usernameReg } from '@src/constants';

@Entity('account')
@Unique('username_mobile_email_unique', ['username', 'mobile', 'email'])
@Unique('username_deleted', ['username', 'deletedAt'])
@Unique('email_deleted', ['email', 'deletedAt'])
@Unique('mobile_deleted', ['mobile', 'deletedAt'])
export class AccountEntity extends PublicEntity {
  @Exclude()
  private nodeAuth: NodeAuth;
  constructor() {
    super();
    this.nodeAuth = new NodeAuth();
  }

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    name: 'username',
    comment: '用户名',
  })
  username: string;

  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
    name: 'password',
    select: false,
    comment: '密码',
  })
  password: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 11,
    name: 'mobile',
    comment: '手机号码',
  })
  mobile: string;

  @Index()
  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    name: 'email',
    comment: '邮箱',
  })
  email: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: () => 1,
    name: 'status',
    comment: '状态,0表示禁止,1表示正常',
  })
  status: number;

  @Column({
    type: 'tinyint',
    nullable: true,
    name: 'platform',
    default: () => 0,
    comment: '平台:0表示普通用户(没权限),1表示为运营管理,2表示入住商家',
  })
  platform: number;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: () => 0,
    name: 'is_super',
    comment: '是否为超级管理员1表示是,0表示不是',
  })
  isSuper: number;

  @BeforeInsert()
  @BeforeUpdate()
  makePassword() {
    if (this.password) {
      this.password = this.nodeAuth.makePassword(this.password);
    }
  }

  @BeforeInsert()
  generateUserNameOrEmailOrMobile() {
    if (this.username) {
      this.mobile =
        this.mobile && isMobilePhone(this.mobile, 'zh-CN') ? this.mobile : `_${this.username}`;
      this.email = this.email && isEmail(this.email) ? this.email : `_${this.username}`;
    } else if (this.mobile) {
      this.username =
        this.username && usernameReg.test(this.username) ? this.username : `_${this.mobile}`;
      this.email = this.email && isEmail(this.email) ? this.email : `_${this.mobile}`;
    } else if (this.email) {
      this.username =
        this.username && usernameReg.test(this.username) ? this.username : `_${this.email}`;
      this.mobile =
        this.mobile && isMobilePhone(this.mobile, 'zh-CN') ? this.mobile : `_${this.email}`;
    }
  }

  @AfterLoad()
  formatResponseData() {
    this.mobile = isMobilePhone(this.mobile, 'zh-CN') ? this.mobile : '';
    this.email = isEmail(this.email) ? this.email : '';
    this.username = usernameReg.test(this.username) ? this.username : '';
  }
}
