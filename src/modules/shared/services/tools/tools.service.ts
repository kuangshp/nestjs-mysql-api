import { Injectable } from '@nestjs/common';
import NodeAuth from 'simp-node-auth';
import * as jwt from 'jsonwebtoken';
import * as uuidv4 from 'uuid';

interface ITokenParams {
  id: number;
  username?: string;
  mobile?: string;
  email?: string;
  platform?: number;
  isSuper?: number;
}

@Injectable()
export class ToolsService {
  private nodeAuth: NodeAuth;
  constructor() {
    this.nodeAuth = new NodeAuth();
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 11:41:47
   * @LastEditors: 水痕
   * @Description: 密码加密的方法
   * @param {string} password
   * @return {*}
   */
  makePassword(password: string): string {
    return this.nodeAuth.makePassword(password);
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-22 12:58:27
   * @LastEditors: 水痕
   * @Description: 校验密码
   * @param {string} password 未加密的密码
   * @param {string} sqlPassword 加密后的密码
   * @return {*}
   */
  checkPassword(password: string, sqlPassword: string): boolean {
    return this.nodeAuth.checkPassword(password, sqlPassword);
  }

  /**
   * @Author: 水痕
   * @Date: 2021-07-26 08:54:18
   * @LastEditors: 水痕
   * @Description: 使用uuid生成token，这里也可以传递用户id与之拼接在一起
   * @param {*}
   * @return {*}
   */
  public get uuidToken(): string {
    return uuidv4.v4().replace(/-/g, '');
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 12:31:53
   * @LastEditors: 水痕
   * @Description: 生成token的方法
   * @param {ITokenParams} params
   * @return {*}
   */
  public generateToken(params: ITokenParams): string {
    const { id, username, mobile, email, platform, isSuper } = params;
    const SECRET: string = process.env.SECRET as string;
    // 生成签名
    return jwt.sign(
      {
        id,
        username,
        mobile,
        email,
        platform,
        isSuper,
      },
      SECRET, // 加盐
      {
        expiresIn: '7d', // 过期时间
      },
    );
  }
}
