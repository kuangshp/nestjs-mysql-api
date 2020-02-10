import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import { OrderListEntity } from '@src/entities/order_list.entity';
import { sqlParamsJoin, sqlToHump, channelObject } from '@src/utils';
import { CartEntity } from '@src/entities/cart.entity';

@Injectable()
export class OrderService extends BaseService {
  constructor (
    @InjectRepository(OrderListEntity)
    private readonly orderRepository: Repository<OrderListEntity>,
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {
    super(orderRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-04 14:05:15
   * @LastEditors: 水痕
   * @Description: 查询订单
   * @param {type} 
   * @return: 
   */
  async tableOrder(tableId: string): Promise<any> {
    try {
      const result = await this.orderRepository.query(`select go.*, goods.title, goods.shop_price, goods.goods_img from order_list as go left join goods on (go.goods_id=goods.id) where go.table_id='${tableId}' and go.status='1'`);
      return sqlToHump(result[0]);
    } catch (e) {
      console.log(e);
      throw new HttpException('查询数据失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-02 10:48:23
   * @LastEditors: 水痕
   * @Description: 创建订单
   * @param {type} 
   * @return: 
   */
  async createOrder(createOrder: any): Promise<any> {
    const { personNum, tableId, remark, goodsList, goodsType } = createOrder;
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        // 插入订单表
        /**
         * `${Date.now()}${Number.parseInt(String(Math.random() * 1000), 10)}`;
         * 先根据桌子号和当前订单的状态去订单表中查询是有已经存在,如果已经存在就是补单
         * status=1表示还没付款
         * status=0表示已经付款
         * goodsType=0 补单
         * goodsType=1 下单
         * goodsType=2 退货
         */
        const orderNo: string = `${Date.now()}${Number.parseInt(String(Math.random() * 1000), 10)}`;
        if (!goodsType) {
          const isExistOrder = await this.orderRepository.findOne({ where: { tableId, status: 1 } });
          if (isExistOrder) {
            for (let item of goodsList) {
              await entityManager.save(OrderListEntity, Object.assign(createOrder, item, { goodsType: 0, orderNo }));
            }
          } else {
            for (let item of goodsList) {
              await entityManager.save(OrderListEntity, Object.assign(createOrder, item, { goodsType: 1, orderNo }));
            }
          }
        } else {
          const goodsId = goodsList[0].goodsId;
          // 限制重复退单的
          const isExistOrder = await this.orderRepository.findOne({ where: { tableId, status: 1, goodsId, goodsType } });
          if (isExistOrder) {
            throw new HttpException('退单失败', HttpStatus.OK);
          } else {
            for (let item of goodsList) {
              await entityManager.save(OrderListEntity, Object.assign(createOrder, item, { goodsType: 2, orderNo }))
            }
          }
        }
        // 删除购物车
        await entityManager.delete(CartEntity, { tableId });
      })
      .then(async () => {
        return await this.orderRepository.find({ where: { tableId, status: 1 } });
        // return await getManager().query('');
      })
      .catch(() => {
        return '下单失败';
      });
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-04 20:40:16
   * @LastEditors: 水痕
   * @Description: 输入桌子号获取订单信息
   * @param {type} 
   * @return: 
   */
  async orderInfo(tableId: string): Promise<any> {
    try {
      return await this.orderRepository.find({ where: { tableId, status: 1 } });
    } catch (e) {
      throw new HttpException('修改数据失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-06 11:23:02
   * @LastEditors: 水痕
   * @Description: 获取订单列表
   * @param {type} 
   * @return: 
   */
  async orderList(options: any): Promise<any> {
    try {
      let { pageSize, pageNumber, status } = channelObject(options);
      pageSize = pageSize || 10;
      pageNumber = pageNumber || 1;
      if (!this.validator.isInt(Number(pageSize)) || !this.validator.isInt(Number(pageNumber))) {
        throw new HttpException(`传递的pageSize:${pageSize},pageNumber:${pageNumber}其中一个不是整数`, HttpStatus.OK);
      } else {
        const sql1 = `select distinct order_no, person_num, table_id, goods_type, remark, created_at, updated_at from order_list where status=${status} `
        const sql2 = ` order by created_at desc limit ${(pageNumber - 1) * pageSize}, ${pageNumber * pageSize};`
        const total = await this.orderRepository.query('select count(distinct order_no) as total from order_list');
        const data = await this.orderRepository.query(sql1 + sql2);
        return {
          data: sqlToHump(data),
          total: total[0].total,
          pageNumber,
          pageSize,
        };
      }
    } catch (e) {
      throw new HttpException(`查询数据失败:${e}`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-06 11:31:51
   * @LastEditors: 水痕
   * @Description: 获取订单详情
   * @param {type} 
   * @return: 
   */
  async orderDetail(status: number, orderNo: string): Promise<any> {
    try {
      return await this.orderRepository.find({ where: { orderNo, status } });
    } catch (e) {
      throw new HttpException(`查询数据详情失败:${e}`, HttpStatus.OK);
    }
  }
}
