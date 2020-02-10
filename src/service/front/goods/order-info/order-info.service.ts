import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { OrderInfoEntity } from '@src/entities/order_info.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderInfoService extends BaseService {
  constructor (
    @InjectRepository(OrderInfoEntity)
    private readonly orderInfoRepository: Repository<OrderInfoEntity>,
  ) {
    super(orderInfoRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-04 16:28:41
   * @LastEditors: 水痕
   * @Description: 根据桌子号获取吃饭人数及备注信息
   * @param {type} 
   * @return: 
   */
  async tableInfo(tableId: string): Promise<any> {
    return await this.orderInfoRepository.findOne({ where: { tableId } });
  }
  /**
   * @Author: 水痕
   * @Date: 2020-02-02 11:09:55
   * @LastEditors: 水痕
   * @Description: 开始下单
   * @param {type} 
   * @return: 
   */
  async start(data: { tableId: string; personNum: string; remark?: string }): Promise<any> {
    try {
      const { tableId, personNum, remark } = data;
      // 如果有就更新之前的数据
      const orderInfo = await this.orderInfoRepository.findOne({ where: { tableId } });
      if (orderInfo) {
        await this.orderInfoRepository.update({ tableId }, { personNum, remark });
        return await this.orderInfoRepository.find({ tableId });
      } else {
        const start = await this.orderInfoRepository.create(data);
        return await this.orderInfoRepository.save(start);
      }
    } catch (e) {
      throw new HttpException('下单失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-02 11:17:06
   * @LastEditors: 水痕
   * @Description: 修改数据失败
   * @param {type} 
   * @return: 
   */
  async changeInfo(data: { tableId: string; personNum: string; remark?: string }): Promise<any> {
    try {
      const { tableId, personNum, remark } = data;
      const { raw: { affectedRows } } = await this.orderInfoRepository.update({ tableId }, { personNum, remark });
      if (affectedRows) {
        return '成功';
      } else {
        return '失败';
      }
    } catch (e) {
      throw new HttpException('修改数据失败', HttpStatus.OK);
    }
  }
}
