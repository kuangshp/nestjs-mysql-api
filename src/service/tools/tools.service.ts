import { Injectable } from '@nestjs/common';
import NodeAuth from 'node-auth0';

import * as uuidv4 from 'uuid/v4';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class ToolsService {
  private nodeAuth: NodeAuth;
  constructor () {
    this.nodeAuth = new NodeAuth();
  }
  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:48:54
   * @LastEditors: 水痕
   * @Description: 生成uuid的方法
   * @param {type} 
   * @return: 
   */
  public get uuid(): string {
    return uuidv4();
  }
  /**
   * @Author: 水痕
   * @Date: 2020-01-07 16:56:15
   * @LastEditors: 水痕
   * @Description: 生产图形验证码的方法
   * @param {type} 
   * @return: 
   */
  getCaptcha(): { data: any, text: string } {
    const captcha: { data: any, text: string } = svgCaptcha.create({
      size: 1,
      fontSize: 50,
      width: 100,
      height: 34,
      background: "#01458E"
    });
    return captcha;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-09 10:09:36
   * @LastEditors: 水痕
   * @Description: 密码加密的方法
   * @param {type} 
   * @return: 
   */
  makePassword(password: string): string {
    return this.nodeAuth.makePassword(password);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-09 10:09:44
   * @LastEditors: 水痕
   * @Description: 校验密码加密
   * @param {type} 
   * @return: 
   */
  checkPassword(password: string, sqlPassword: string): boolean {
    return this.nodeAuth.checkPassword(password, sqlPassword);
  }
}
