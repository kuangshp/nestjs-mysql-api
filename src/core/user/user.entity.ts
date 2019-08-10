import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

import NodeAuth from 'node-auth0';
import * as jwt from 'jsonwebtoken';
import { UserRep } from './dto/user.rep.dto';

@Entity('user')
export class UserEntity {
  private nodeAuth: NodeAuth;
  constructor() {
    this.nodeAuth = new NodeAuth(8, 10, true);
  }

  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 150,
    name: 'uuid',
    generated: 'uuid',
    comment: 'uuid',
  })
  uuid: string;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 100,
    name: 'name',
    comment: '姓名',
  })
  name: string;

  @Column('varchar', {
    nullable: false,
    name: 'password',
    comment: '密码',
  })
  password: string;

  @Column('tinyint', {
    nullable: true,
    default: () => 1,
    name: 'is_active',
    comment: '是否活跃',
  })
  isActive: number | null;

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'email',
    comment: 'email',
  })
  email: string | null;

  @Column('varchar', {
    nullable: true,
    length: 11,
    name: 'mobile',
    comment: '手机号码',
  })
  mobile: string | null;

  @Column('tinyint', {
    nullable: true,
    default: () => 0,
    comment: '性别',
    name: 'gender',
  })
  gender: number | null;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;

  /**
   * @Description: 插入数据前钩子函数进行加密
   * @Author: 水痕
   * @LastEditors: 水痕
   * @param {type}
   * @return:
   * @Date: 2019-07-30 16:10:16
   */
  @BeforeInsert()
  async makePassword() {
    this.password = await this.nodeAuth.makePassword(this.password);
  }

  /**
   * @Description: 定义数据返回格式
   * @Author: 水痕
   * @LastEditors: 水痕
   * @param {type}
   * @return:
   * @Date: 2019-07-30 16:10:06
   */
  toResponseObject(isShowToken: boolean = true): UserRep {
    const { password, token, nodeAuth, ...params } = this;
    if (isShowToken) {
      return {
        token,
        ...params,
      };
    }
    return {
      ...params,
    };
  }

  /**
   * @Description: 检查密码
   * @Author: 水痕
   * @LastEditors: 水痕
   * @param {type}
   * @return:
   * @Date: 2019-07-30 16:09:52
   */
  async checkPassword(password: string, sqlPassword: string) {
    return await this.nodeAuth.checkPassword(password, sqlPassword);
  }

  /**
   * @Description: 生成token签名
   * @Author: 水痕
   * @LastEditors: 水痕
   * @param {type}
   * @return:
   * @Date: 2019-07-30 16:06:03
   */
  private get token() {
    const { password, ...params } = this;
    // 生成签名
    return jwt.sign(
      {
        params,
      },
      process.env.SECRET, // 加盐
      {
        expiresIn: '7d', // 过期时间
      },
    );
  }
}
