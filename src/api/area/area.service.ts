import { Injectable } from '@nestjs/common';
import { AreaEntity } from './entities/area.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 11:14:07
   * @LastEditors: 水痕
   * @Description: 根据父节点id查询数据
   * @param {number} pid
   * @return {*}
   */
  async getDataByPidApi(pid: number): Promise<AreaEntity[]> {
    pid = pid ? pid : 0;
    return await this.areaRepository
      .createQueryBuilder('area')
      .select(['area.id', 'area.name'])
      .where('(area.pid=:pid)', { pid })
      .getMany();
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 11:13:49
   * @LastEditors: 水痕
   * @Description: 查询全部的市
   * @return {*}
   */
  async getAllCityApi(): Promise<AreaEntity[]> {
    return await this.areaRepository
      .createQueryBuilder('area')
      .select(['area.id', 'area.name', 'area.shortname', 'area.pinyin'])
      .andWhere('area.level=2')
      .orderBy({ 'area.pinyin': 'ASC' })
      .getMany();
  }
}
