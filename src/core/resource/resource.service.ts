import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create.resource.dto';
import { ResourceEntity } from './resource.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateResourceDto } from './dto/update.resource.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
  ) {}

  /**
   * @param {type}
   * @return:
   * @Description: 创建资源
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-15 13:21:30
   */
  async create(data: CreateResourceDto): Promise<ResourceEntity> {
    return await this.resourceRepository.save(data);
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据id修改资源
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-15 13:24:03
   */
  async updateById(
    id: string,
    data: UpdateResourceDto,
  ): Promise<ResourceEntity> {
    await this.resourceRepository.update(id, data);
    return await this.resourceRepository.findOne({ where: { id } });
  }

  /**
   * @param {type}
   * @return:
   * @Description: 查询全部的资源
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-15 13:25:26
   */
  async showAll(pageSize: number, pageNumber: number): Promise<any> {
    const [roles, total] = await this.resourceRepository
      .createQueryBuilder('resource')
      .offset(pageNumber - 1) // 从多少条开始
      .limit(pageSize) // 查询多少条数据
      .orderBy('id', 'DESC') // 排序
      .getManyAndCount(); // 查询到数据及个数，返回的是一个数组
    return [roles, total];
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据id查询资源id
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-15 13:26:02
   */
  async getById(id: string): Promise<ResourceEntity> {
    return await this.resourceRepository.findOne({ where: { id } });
  }
}
