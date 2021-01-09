import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import SimpNodeAuth from 'simp-node-auth';

import * as uuidv4 from 'uuid';
import { isUUID, isEmail, isInt, isMobilePhone } from 'class-validator';

@Injectable()
export class ToolsService {
  private simpNodeAuth: SimpNodeAuth;
  constructor () {
    this.simpNodeAuth = new SimpNodeAuth();
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
    return uuidv4.v4();
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
    return this.simpNodeAuth.makePassword(password);
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
    return this.simpNodeAuth.checkPassword(password, sqlPassword);
  }


  /**
   * @Author: 水痕
   * @Date: 2020-01-25 21:56:18
   * @LastEditors: 水痕
   * @Description: 判断是否为uuid
   * @param {type} 
   * @return: 
   */
  public isUUID(id: string): boolean {
    return isUUID(id);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-25 21:56:55
   * @LastEditors: 水痕
   * @Description: 判断是否为id
   * @param {type} 
   * @return: 
   */
  public isInt(id: string): boolean {
    return isInt(Number(id));
  }

  public isEmail(str: string): boolean {
    return isEmail(str);
  }

  public isMobilePhone(mobile: string, nation: any = 'zh-CN'): boolean {
    return isMobilePhone(mobile, nation);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-04-18 13:30:46
   * @LastEditors: 水痕
   * @Description: 校验分页
   * @param {type} 
   * @return: 
   */
  public checkPage(pageSize: number, pageNumber: number): void {
    if (!isInt(Number(pageSize)) || !isInt(Number(pageNumber))) {
      throw new HttpException(`传递的pageSize:${pageSize},pageNumber:${pageNumber}其中一个不是整数`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 13:14:48
   * @LastEditors: 水痕
   * @Description: 根据id查询单条数据
   * @param {type} 
   * @return: 
   */
  public async findByIdOrUuid(id: string, repository: any) {
    if (this.isUUID(id)) {
      return await repository.findOne({ uuid: id });
    } else if (this.isInt(id)) {
      return await repository.findOne({ id: Number(id) });
    } else {
      return new HttpException(`你传递的参数错误:${id}不是uuid或者id的一种`, HttpStatus.OK);
    }
  }
}
