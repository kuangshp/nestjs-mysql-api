import { Controller, Get, HttpCode, HttpStatus, Query, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import adminConfig from '@src/config/admin.config';
import { OrderService } from '@src/service/front/goods/order/order.service';

@ApiTags('商品订单模块')
@ApiBearerAuth()
@Controller(`${adminConfig.adminPath}/order`)
export class OrderController {
  constructor (
    private readonly orderService: OrderService,
  ) { }

  @ApiOperation({ summary: '获取订单列表', description: '订单列表' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async orderList(@Query() querOption: { [propsName: string]: any }): Promise<any> {
    return await this.orderService.orderList(querOption);
  }

  @ApiOperation({ summary: '获取订单详情', description: '根据单号获取订单详情' })
  @HttpCode(HttpStatus.OK)
  @Get(':status/:order_no')
  async orderDetail(@Param('status') status: number, @Param('order_no') orderNo: string, ): Promise<any> {
    return await this.orderService.orderDetail(status, orderNo);
  }
}
