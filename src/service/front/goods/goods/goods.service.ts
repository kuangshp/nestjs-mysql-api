import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { GoodsEntity } from '@src/entities/goods.entity';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { GoodsCategoryEntity } from '@src/entities/goods_category.entity';
import { sqlWhere, channelObject, toHump } from '@src/utils';

@Injectable()
export class GoodsService extends BaseService {
  constructor (
    @InjectRepository(GoodsEntity)
    private readonly goodsRepository: Repository<GoodsEntity>,
    @InjectRepository(GoodsCategoryEntity)
    private readonly goodsCategoryRepository: Repository<GoodsCategoryEntity>,
  ) {
    super(goodsRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-31 16:07:49
   * @LastEditors: 水痕
   * @Description: 分页查询商品及关联到分类表
   * @param {type} 
   * @return: 
   */
  async findPage(querOption: any): Promise<any> {
    try {
      let { pageSize, pageNumber, categoryIds, title, status } = channelObject(querOption);
      pageSize = pageSize || 10;
      pageNumber = pageNumber || 1;
      if (!this.validator.isInt(Number(pageSize)) || !this.validator.isInt(Number(pageNumber))) {
        throw new HttpException(`传递的pageSize:${pageSize},pageNumber:${pageNumber}其中一个不是整数`, HttpStatus.OK);
      } else {
        const sql1: string = 'select goods.*, goods_category.title as category_title, is_best+is_hot+is_new as front from goods left join goods_category on goods.category_id = goods_category.id ';
        const sql2: string = sqlWhere({ status }, 'goods');
        let sql3: string = '';
        if (title) {
          sql3 = (sql2 && sql2.trim()) ? ` and goods.title like '%${title}%' ` : ` where goods.title like '%${title}%' `;
        }
        let sql4: string = '';
        if (categoryIds) {
          const categoryList = categoryIds.split(',');
          console.log(categoryList)
          sql4 = (sql2 + sql3 && (sql2 + sql3).trim()) ? ` and goods.category_id in (${categoryList}) ` : ` where goods.category_id in (${categoryList}) `;
        }
        const sql5: string = ` order by front desc, created_at desc limit ${(pageNumber - 1) * pageSize}, ${pageNumber * pageSize};`;
        const sql6: string = sql1 + sql2 + sql3 + sql4 + sql5;
        console.log(sql6);
        let data = await this.goodsRepository.query(sql6);
        const total = await this.goodsRepository.query('select count(*) as total from goods' + sql2 + sql3 + sql4);
        return {
          data: data.map((item: any) => {
            let result = {};
            for (let key in item) {
              result[toHump(key)] = item[key];
            }
            return result;
          }),
          total: total[0].total,
          pageNumber,
          pageSize,
        };
      }
    } catch (e) {
      throw new HttpException(`查询数据错误:${e}`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-01 12:44:15
   * @LastEditors: 水痕
   * @Description: 前端商品分类获取全部的商品
   * @param {type} 
   * @return: 
   */
  async goodsList(): Promise<any> {
    try {
      const categoryList = await this.goodsCategoryRepository.find({ where: { status: 1 }, order: { sort: 'ASC' } });
      const goodsResultList = await this.goodsRepository.find({ where: { isDelete: '1' } });
      return categoryList.map(item => {
        let goods = goodsResultList.filter(it => it.categoryId == item.id);
        return Object.assign(item, {
          goods,
        })
      })
    } catch (e) {
      throw new HttpException(`查询数据错误:${e}`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-01 13:28:41
   * @LastEditors: 水痕
   * @Description: 根据id查询商品详情
   * @param {type} 
   * @return: 
   */
  async goodsDetails(id: string): Promise<any> {
    try {
      let sql1: string = "select g.*, c.title as category from goods g left join goods_category c on (g.category_id=c.id) where g.is_delete='1'";
      let sql2: string = "";
      if (this.isUUID(id)) {
        sql2 = `and g.uuid='${id}'`;
      } else if (this.isInt(id)) {
        sql2 = `and g.id=${id}`;
      }
      const result = await this.goodsRepository.query(sql1 + sql2);
      if (result && Array.isArray(result)) {
        return result[0];
      } else {
        return null;
      }
    } catch (e) {
      throw new HttpException(`查询数据错误:${e}`, HttpStatus.OK);
    }
  }
}
