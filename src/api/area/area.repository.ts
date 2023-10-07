import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaEntity } from './entities/area.entity';

@Injectable()
export class AreaRepository {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 11:17:26
   * @LastEditors: 水痕
   * @Description: 根据城市id查找具体地址
   * @param {number} cityId
   * @param {*} address
   * @return {*}
   */
  async getFullAddressByCityId(cityId: number, address = ''): Promise<string> {
    try {
      const result: Pick<AreaEntity, 'mergerName'> | null = await this.areaRepository
        .createQueryBuilder('area')
        .select(['area.mergerName'])
        .where('(area.id = :cityId)', { cityId })
        .getOne();
      if (result?.mergerName) {
        const addressList = result.mergerName.split(',');
        addressList.shift();
        return addressList.join('') + address;
      } else {
        throw new HttpException(`${cityId}在城市表找不到数据`, HttpStatus.OK);
      }
    } catch (e: unknown) {
      console.log(e);
      throw new HttpException('找不到数据', HttpStatus.OK);
    }
  }
}
