import { Injectable } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { GoodsCategoryEntity } from '@src/entities/goods_category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends BaseService {
  constructor (
    @InjectRepository(GoodsCategoryEntity)
    private readonly goodsCategoryRepository: Repository<GoodsCategoryEntity>,
  ) {
    super(goodsCategoryRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-04 18:52:57
   * @LastEditors: 水痕
   * @Description: 查询全部的分类
   * @param {type} 
   * @return: 
   */
  async categoryList(): Promise<any> {
    try {
      return await this.goodsCategoryRepository.find({ where: { status: 1 }, order: { sort: 'ASC' } });
    } catch (e) {
      console.log(e);
    }
  }
}
