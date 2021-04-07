import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import NodeAuth from 'simp-node-auth';
import * as jwt from 'jsonwebtoken';
import { isInt } from 'class-validator';

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
   * @Date: 2021-03-22 12:57:56
   * @LastEditors: 水痕
   * @Description: 校验分页数据
   * @param {number} pageNumber 当前页
   * @param {number} pageSize 一页显示多少条数据
   * @return {*}
   */
  public checkPage(pageNumber: number, pageSize: number): void {
    if (!isInt(Number(pageSize)) || !isInt(Number(pageNumber))) {
      throw new HttpException(
        `传递的pageSize:${pageSize},pageNumber:${pageNumber}其中一个不是整数`,
        HttpStatus.OK,
      );
    }
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
