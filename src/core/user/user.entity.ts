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

  @PrimaryGeneratedColumn('uuid', { comment: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '姓名' })
  name: string;

  @Column({ type: 'varchar', length: 250, comment: '密码' })
  password: string;

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
    const { id, name, token, createAt, updateAt } = this;
    if (isShowToken) {
      return { id, name, token, createAt, updateAt };
    }
    return { id, name, createAt, updateAt };
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
    const { id, name } = this;
    // 生成签名
    return jwt.sign(
      {
        id,
        name,
      },
      process.env.SECRET, // 加盐
      {
        expiresIn: '7d', // 过期时间
      },
    );
  }
}
