import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  /**
   * @param {type}
   * @return:
   * @Description: 添加角色
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-12 01:24:55
   */
  async create(data: RoleDto): Promise<RoleEntity> {
    return await this.roleRepository.save(data);
  }

  /**
   * @param {type}
   * @return:
   * @Description:查询全部的角色
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-14 16:38:07
   */
  async showAll(pageSize: number, pageNumber: number): Promise<any> {
    const [roles, total] = await this.roleRepository
      .createQueryBuilder('role')
      .offset(pageNumber - 1) // 从多少条开始
      .limit(pageSize) // 查询多少条数据
      .orderBy('id', 'DESC') // 排序
      .getManyAndCount(); // 查询到数据及个数，返回的是一个数组
    return [roles, total];
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据用户id查询角色
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-14 16:57:29
   */
  async getById(id: string): Promise<RoleEntity> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据用户id修改角色
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-12 02:29:26
   */
  async updateById(id: string, data: RoleDto): Promise<RoleEntity> {
    await this.roleRepository.update(id, data);
    return await this.roleRepository.findOne({ where: { id } });
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据角色id删除角色
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-12 02:35:32
   */
  async destroyById(id: string): Promise<string> {
    await this.roleRepository.delete(id);
    return '删除成功';
  }
}
