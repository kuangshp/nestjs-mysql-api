import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column, Index, BeforeInsert, BeforeUpdate, AfterLoad } from 'typeorm';
import NodeAuth from 'simp-node-auth';
import { Exclude, Expose } from 'class-transformer';
import { isEmail, isMobilePhone } from 'class-validator';
import { usernameReg } from '@src/constants';
import { StatusEnum } from '@src/enums';

@Entity('account')
export class AccountEntity extends SharedEntity {
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
  username!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'password',
    select: false,
    comment: '密码',
  })
  password!: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 11,
    name: 'mobile',
    nullable: true,
    comment: '手机号码',
  })
  mobile!: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 50,
    name: 'email',
    nullable: true,
    comment: '邮箱',
  })
  email!: string;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '1',
    comment: '状态,0表示禁止,1表示正常',
  })
  status!: StatusEnum;

  @Column({
    type: 'tinyint',
    name: 'is_super',
    default: '0',
    comment: '是否为超级管理员1表示是,0表示不是',
  })
  isSuper!: number;

  @Expose()
  statusStr(): string {
    return this.status === 0 ? '禁止' : '正常';
  }

  @Expose()
  isSuperStr(): string {
    return this.isSuper === 1 ? '超级管理员' : '普通用户';
  }

  @BeforeInsert()
  @BeforeUpdate()
  makePassword(): void {
    if (this.password) {
      this.password = this.nodeAuth.makePassword(this.password);
    }
  }

  @BeforeUpdate()
  @BeforeInsert()
  generateUserNameOrEmailOrMobile(): void {
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
  formatResponseData(): void {
    this.mobile = isMobilePhone(this.mobile, 'zh-CN') ? this.mobile : '';
    this.email = isEmail(this.email) ? this.email : '';
    this.username = usernameReg.test(this.username) ? this.username : '';
  }
}
