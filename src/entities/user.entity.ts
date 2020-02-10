import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import NodeAuth from 'node-auth0';


@Entity('user')
export class UserEntity {
  @Exclude()
  private nodeAuth: NodeAuth;
  constructor () {
    this.nodeAuth = new NodeAuth();
  }

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;


  @Column('varchar', {
    nullable: false,
    primary: true,
    generated: 'uuid',
    length: 50,
    name: 'uuid',
    comment: 'uuid',
  })
  uuid: string;

  @Column('varchar', {
    nullable: false,
    length: 50,
    name: 'username',
    comment: '用户名',
  })
  username: string;


  @Exclude() // 表示排除字段不返回给前端
  @Column('varchar', {
    nullable: false,
    length: 100,
    name: 'password',
    comment: '用户密码',
  })
  password: string;


  @Column('varchar', {
    nullable: true,
    length: 11,
    name: 'mobile',
    comment: '用户手机号码',
  })
  mobile: string | null;


  @Column('varchar', {
    nullable: true,
    length: 50,
    name: 'email',
    comment: '用户邮箱',
  })
  email: string | null;

  @Exclude()
  @Column('tinyint', {
    nullable: true,
    default: () => "'1'",
    name: 'status',
    comment: '状态',
  })
  status: number | null;


  @Column('varchar', {
    nullable: false,
    length: 50,
    name: 'platform',
    comment: '平台',
  })
  platform: string;

  @Column('tinyint', {
    nullable: true,
    default: () => 0,
    name: 'is_super',
    comment: '是否为超级管理员',
  })
  isSuper: number | null;


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

  @Expose() // 表示根据现有的字段生成一个新的字段
  get is_active(): string {
    return this.status ? '有效' : '无效';
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:02:59
   * @LastEditors: 水痕
   * @Description: 插件数据库前先给密码加密
   * @param {type} 
   * @return: 
   */
  @BeforeInsert()
  makePassword() {
    this.password = this.nodeAuth.makePassword(this.password);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:03:45
   * @LastEditors: 水痕
   * @Description: 检查密码是否正确
   * @param {type} 
   * @return: 
   */
  checkPassword(password: string, sqlPassword: string) {
    return this.nodeAuth.checkPassword(password, sqlPassword);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:04:38
   * @LastEditors: 水痕
   * @Description: 生产token签名
   * @param {type} 
   * @return: 
   */
  @Expose()
  private get token() {
    const { id, uuid, username, mobile, email, isSuper } = this;
    // 生成签名
    return jwt.sign(
      {
        id,
        uuid,
        username,
        mobile,
        email,
        isSuper,
      },
      process.env.SECRET, // 加盐
      {
        expiresIn: '7d', // 过期时间
      },
    );
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:19:49
   * @LastEditors: 水痕
   * @Description: 定义返回数据,用了这个函数后上面的Exclude和Expose就失效了
   * @param {type} 
   * @return: 
   */
  public toResponseObject(isShowToken: boolean = true): object {
    const { nodeAuth, password, token, ...params } = this;
    if (isShowToken) {
      return {
        token,
        ...params,
      };
    } else {
      return {
        ...params,
      };
    }
  }
}
