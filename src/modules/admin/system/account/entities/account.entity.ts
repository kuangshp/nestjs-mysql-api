import { Entity, Column, Unique, Index, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import NodeAuth from 'simp-node-auth';
import * as jwt from 'jsonwebtoken';
import { isUUID } from 'class-validator';

import { PublicEntity } from '@src/modules/shared/entities/public.entity';
import { ObjectType } from '@src/types';
const SECRET: string = process.env.SECRET as string;

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

  @BeforeInsert()
  @BeforeUpdate()
  makePassword() {
    if (this.password) {
      this.password = this.nodeAuth.makePassword(this.password);
    }
  }

  @Expose()
  private get token() {
    const { id, username, mobile, email, platform, isSuper } = this;
    // 生成签名
    return jwt.sign(
      {
        id,
        username,
        mobile,
        email,
        isSuper,
        platform,
      },
      SECRET, // 加盐
      {
        expiresIn: '7d', // 过期时间
      },
    );
  }
  
  public toResponseObject(isShowToken = false): ObjectType {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nodeAuth, password, token, mobile, email, username, ...params } = this;
    const responseData: ObjectType = {
      mobile: isUUID(mobile) ? '' : mobile,
      email: isUUID(email) ? '' : email,
      username: isUUID(username) ? '' : username,
      ...params,
    };
    if (isShowToken) {
      return { ...responseData, token };
    } else {
      return responseData;
    }
  }
}