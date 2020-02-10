import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Validator } from 'class-validator';

@Injectable()
export class BaseService {
  private tableModel: any;
  public validator: Validator;
  constructor (tableModel: Repository<any>) {
    this.tableModel = tableModel;
    this.validator = new Validator();
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
    return this.validator.isUUID(id);
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
    return this.validator.isInt(Number(id));
  }
  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:38:03
   * @LastEditors: 水痕
   * @Description: 判断一个实体类中是否含有该id
   * @param {type} 
   * @return: 
   */
  // public hasId(entity: any): boolean {
  //   return this.tableModel.hasId(entity)
  // };

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:38:20
   * @LastEditors: 水痕
   * @Description: 获取实体类中的id
   * @param {type} 
   * @return: 
   */
  // public getId(entity: any): any {
  //   return this.tableModel.getId(entity);
  // };

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 23:03:45
   * @LastEditors: 水痕
   * @Description: 保存的方法
   * @param {type} 
   * @return: 
   */
  public async save(entity: any, options?: any): Promise<any> {
    return this.tableModel.save(entity, options);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:23:18
   * @LastEditors: 水痕
   * @Description: 创建数据的方法
   * @param {type} 
   * @return: 
   */
  public async create(data: object): Promise<any> {
    return await this.tableModel.create(data);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:24:04
   * @LastEditors: 水痕
   * @Description: 根据条件计算条数
   * @param {type} 
   * @return: 
   */
  // public async count(options?: object): Promise<number> {
  //   return await this.tableModel.count(options);
  // }

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:28:11
   * @LastEditors: 水痕
   * @Description: 查找到第一条数据
   * @param {type} 
   * @return: 
   */
  public async findOne(options?: object): Promise<any | undefined> {
    return await this.tableModel.findOne({ where: options });
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 08:53:00
   * @LastEditors: 水痕
   * @Description: 根据id查询出一条数据
   * @param {type} 
   * @return: 
   */
  public async findById(id: string): Promise<any> {
    if (this.isUUID(id)) {
      return await this.tableModel.findOne({ uuid: id });
    } else if (this.isInt(id)) {
      return await this.tableModel.findOne({ id });
    } else {
      throw new HttpException(`传递的id必须是整形或者是uuid字符串,你传递的是:${id}`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:26:23
   * @LastEditors: 水痕
   * @Description: 查询一个ids列表
   * @param {type} 
   * @return: 
   */
  // public async findByIds(ids: any[], options?: object): Promise<any[]> {
  //   return await this.tableModel.findByIds(ids, { where: options });
  // }

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:31:27
   * @LastEditors: 水痕
   * @Description: 查询到全部的数据
   * @param {type} 
   * @return: 
   */
  // public async find(options?: object): Promise<any[]> {
  //   return await this.tableModel.find({ where: options });
  // }
  /**
   * @Author: 水痕
   * @Date: 2020-01-23 16:24:20
   * @LastEditors: 水痕
   * @Description: 分页单表查询数据(适合单表)
   * @param {type} 
   * @return: 
   */
  public async findPage(options?: { [propsName: string]: any }): Promise<any> {
    let { pageSize, pageNumber, ...others } = options;
    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;
    if (!this.validator.isInt(Number(pageSize)) || !this.validator.isInt(Number(pageNumber))) {
      throw new HttpException(`传递的pageSize:${pageSize},pageNumber:${pageNumber}其中一个不是整数`, HttpStatus.OK);
    } else {
      const [data, total] = await this.tableModel.findAndCount({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        order: {
          createdAt: 'DESC',
        },
        where: {
          ...others,
        }
      });
      return {
        data,
        total,
        pageNumber,
        pageSize,
      };
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 13:19:52
   * @LastEditors: 水痕
   * @Description: 根据id获取uuid删除数据
   * @param {type} 
   * @return: 
   */
  public async deleteById(id: string): Promise<any> {
    if (this.validator.isUUID(id)) {
      return await this.tableModel.delete({ uuid: id });
    } else if (this.validator.isInt(Number.parseInt(id))) {
      return await this.tableModel.delete({ id });
    } else {
      throw new HttpException(`传递的id必须是整形或者是uuid字符串,你传递的是:${id}`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-30 12:34:05
   * @LastEditors: 水痕
   * @Description: 根据id更新数据
   * @param {type} 
   * @return: 
   */
  public async updateById(id: string, data: any): Promise<any> {
    if (this.isUUID(id)) {
      return await this.tableModel.update({ uuid: id }, data);
    } else if (this.isInt(id)) {
      return await this.tableModel.update({ id }, data);
    } else {
      throw new HttpException(`传递的id必须是整形或者是uuid字符串,你传递的是:${id}`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-22 19:29:28
   * @LastEditors: 水痕
   * @Description: 自己写sql语句
   * @param {type} 
   * @return: 
   */
  public async query(query: string, parameters?: any[]): Promise<any> {
    return await this.tableModel.query(query, parameters);
  }
}