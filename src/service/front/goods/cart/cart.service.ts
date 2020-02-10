import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '@src/entities/cart.entity';
import { CreateCartDto } from '@src/controllers/front/cart/dto/create.cart.dto';
import { GoodsEntity } from '@src/entities/goods.entity';
import { sqlToHump } from '@src/utils';

@Injectable()
export class CartService extends BaseService {
  constructor (
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(GoodsEntity)
    private readonly goodsRepository: Repository<GoodsEntity>,
  ) {
    super(cartRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-02 14:15:55
   * @LastEditors: 水痕
   * @Description: 根据桌子号获取购物车列表
   * @param {type} 
   * @return: 
   */
  async cartList(tableId: string): Promise<any> {
    try {
      const cartList = await this.cartRepository.query(`select cart.*, g.title, g.shop_price, g.goods_img from cart left join goods as g on (cart.goods_id=g.id) where table_id='${tableId}'`);
      return sqlToHump(cartList);
    } catch (e) {
      console.log(e);
      throw new HttpException('获取失败', HttpStatus.OK);
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2020-02-02 09:37:10
   * @LastEditors: 水痕
   * @Description: 加入购物车
   * @param {type} 
   * @return: 
   */
  async createCart(createCart: any): Promise<any> {
    const { tableId, goodsId, num } = createCart;
    // 先判断是否存在,如果存在就修改数量(注意限购)
    const isExistGoodsCart = await this.cartRepository.findOne({ tableId, goodsId });
    console.log(isExistGoodsCart, tableId, goodsId, num, '---');
    if (isExistGoodsCart) {
      // 查询限购数量
      const goods = await this.goodsRepository.findOne({ id: goodsId });
      const mostNum = goods.mostNum;
      console.log(goods.mostNum)
      if ((num + isExistGoodsCart.num) >= mostNum) {
        await this.cartRepository.update({ tableId, goodsId }, { num: mostNum });
      } else {
        await this.cartRepository.update({ tableId, goodsId }, { num: (num + isExistGoodsCart.num) });
      }
    } else {
      const result = await this.cartRepository.create(createCart);
      await this.cartRepository.save(result);
    }
    // 返回当前桌子号全部的购物车数据并且关联到商品表
    return this.cartRepository.query(`select cart.*, g.title, g.shop_price, g.goods_img from cart left join goods g on (cart.goods_id=g.id) where cart.table_id='${tableId}'`);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-02 10:25:56
   * @LastEditors: 水痕
   * @Description: 修改购物车的数据
   * @param {type} 
   * @return: 
   */
  async changeCart(changeCart: any): Promise<any> {
    try {
      const { type, tableId, goodsId, num } = changeCart;
      const cart: any = await this.cartRepository.findOne({ where: { tableId, goodsId } });
      let cartNum = cart.num;
      if (type === 1) { // 添加数据
        const goods = await this.goodsRepository.findOne({ where: { id: goodsId } });
        if ((cartNum + 1) > goods.mostNum) {
          throw new HttpException(`该商品${goods.title}限购${goods.mostNum}`, HttpStatus.OK);
        }
        await this.cartRepository.update({ tableId, goodsId }, { num: (cartNum + 1) });
        return this.cartRepository.query(`select cart.*, g.title, g.shop_price, g.goods_img from cart left join goods g on (cart.goods_id=g.id) where cart.table_id='${tableId}'`);
      } else if (type === 0) { // 减少数据
        if (cartNum == 1) {
          await this.cartRepository.delete({ tableId, goodsId });
        } else {
          await this.cartRepository.update({ tableId, goodsId }, { num: (cartNum - 1) });
        }
        return this.cartRepository.query(`select cart.*, g.title, g.shop_price, g.goods_img from cart left join goods g on (cart.goods_id=g.id) where cart.table_id='${tableId}'`);
      } else {
        throw new HttpException('传递的数据有错误,只能传递0或者1', HttpStatus.OK);
      }
    } catch (e) {
      throw new HttpException('添加数据失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-02 10:29:53
   * @LastEditors: 水痕
   * @Description: 获取购物车的数量
   * @param {type} 
   * @return: 
   */
  async cartNum(tableId: string): Promise<number> {
    const nums: any = await this.cartRepository.query(`select sum(num) as num from cart where table_id='${tableId}'`);
    if (nums && nums.length) {
      return nums[0].num;
    } else {
      return 0;
    }
  }
}
