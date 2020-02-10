import { Controller, Get, HttpCode, HttpStatus, Query, Param, Post, Body, Response } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import adminConfig from '@src/config/admin.config';
import { ObjectType } from '@src/types';
import { OrderRep } from './dto/order.rep.dto';
import { OrderService } from '@src/service/front/goods/order/order.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { OrderInfoDto } from './dto/order.info.dto';
import { OrderInfoService } from '@src/service/front/goods/order-info/order-info.service';
import { InjectConfig, ConfigService } from 'nestjs-config';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';

@ApiTags('前端商品订单模块')
@Controller(`${adminConfig.frontPath}/order`)
export class OrderController {
  private alipayOptions: any;
  constructor (
    private readonly orderService: OrderService,
    private readonly orderInfoService: OrderInfoService,
    @InjectConfig() private readonly configService: ConfigService,
  ) {
    this.alipayOptions = {
      appId: this.configService.get('alipay.appId'),
      privateKey: this.configService.get('alipay.appPrivKeyFile'),
      // alipayPubKeyFile: this.configService.get('alipay.alipayPubKeyFile'),
    }
  }

  @ApiOperation({ summary: '开始下单', description: '开始下单选择人数及备注信息' })
  @Post('start')
  @HttpCode(HttpStatus.CREATED)
  async start(@Body() data: OrderInfoDto): Promise<any> {
    return this.orderInfoService.start(data);
  }

  @ApiOperation({ summary: '修改人数和备注信息', description: '根据桌子号修改就餐人数和备注信息' })
  @Post('change_info')
  @HttpCode(HttpStatus.CREATED)
  async changeInfo(@Body() data: OrderInfoDto): Promise<any> {
    return this.orderInfoService.changeInfo(data);
  }

  @ApiOperation({ summary: '根据桌子号确认下单', description: '购物车下单' })
  @Post('confirm_order')
  @HttpCode(HttpStatus.CREATED)
  async confirmOrder(@Body() createOrder: CreateOrderDto): Promise<any> {
    return this.orderService.createOrder(createOrder);
  }

  @ApiOperation({ summary: '根据桌子号获取订单详情', description: '输入桌子号' })
  @Get('order_info/:tableId')
  @HttpCode(HttpStatus.OK)
  async orderInfo(@Param('tableId') tableId: string): Promise<any> {
    return this.orderService.orderInfo(tableId);
  }

  @ApiOperation({ summary: '支付宝支付', description: '支付宝支付' })
  @Get('doPay')
  @HttpCode(HttpStatus.OK)
  async doPay(): Promise<any> {
    // const options = this.alipayOptions;
    // console.log(options, '--支付宝支付--');
    // const basicParams = {
    //   "return_url": 'http://a.itying.com',
    //   //异步通知地址
    //   "notify_url": "http://localhost:3000/api/v1/alipayNotify",
    // }
    // const data = {
    //   subject: '辣条',
    //   out_trade_no: '1232423',
    //   total_amount: '0.1'
    // }
    const formData = new AlipayFormData();
    formData.addField('notifyUrl', 'http://localhost:3000/api/v1/docs');
    formData.addField('bizContent', {
      outTradeNo: 'out_trade_no',
      productCode: 'FAST_INSTANT_TRADE_PAY',
      totalAmount: '0.01',
      subject: '商品',
      body: '商品详情',
    });
    const alipaySdk = new AlipaySdk(this.alipayOptions);
    console.log(alipaySdk);
    const result = await alipaySdk.exec(
      'alipay.trade.page.pay',
      {},
      { formData: formData },
    );
    console.log(result);
    return alipaySdk;
  }

  // @Post('alipayNotify')
  // async alipayNotify(@Body() body: any): Promise<any> {
  //   const options = this.alipayOptions;
  //   const service = new Alipay(options);
  //   const result = await service.makeNotifyResponse(body);
  //   console.log(result, '---');
  //   if (result.code == 0) {
  //     console.log('success');
  //   }
  // }

  @ApiOperation({ summary: '根据桌子号查订单信息', description: '获取客户人数及备注信息' })
  @Get(':tableId')
  @HttpCode(HttpStatus.OK)
  async tableOrder(@Param('tableId') tableId: string): Promise<any> {
    return await this.orderInfoService.tableInfo(tableId);
  }
}
