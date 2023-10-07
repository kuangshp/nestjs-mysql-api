import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getRandomNum, randomString, strToMd5 } from '@src/utils';

@Injectable()
export class ToolsService {
  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:00:34
   * @LastEditors: 水痕
   * @Description: 创建一个生成uuid的方法
   * @return {*}
   */
  get uuidToken(): string {
    return uuidv4().replace(/-/g, '');
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:00:08
   * @LastEditors: 水痕
   * @Description: 随机生成加密盐
   * @return {*}
   */
  get getRandomSalt(): string {
    return randomString(getRandomNum(10, 20));
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:00:19
   * @LastEditors: 水痕
   * @Description: 获取当前ip地址
   * @param {Request} req
   * @return {*}
   */
  getReqIP(req: Request): string {
    const currentIp =
      ((req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress)?.replace(
        '::ffff:',
        ''
      ) ?? '';
    // 处理代理后的多个ip地址,只拿第一个ip
    if (currentIp.split(',').length) {
      return currentIp.split(',').shift()!;
    } else {
      return currentIp;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:10:17
   * @LastEditors: 水痕
   * @Description: 密码加密
   * @param {string} password 原始密码
   * @param {string} salt 盐
   * @return {*}
   */
  makePassword(password: string, salt: string): string {
    return strToMd5(`${password}_${salt}`);
  }
}
