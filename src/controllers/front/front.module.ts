import { Module } from '@nestjs/common';
import { GoodsController } from './goods/goods.controller';
import { CategoryController } from './category/category.controller';
import { ServiceModule } from '@src/module/service/service.module';
import { CartController } from './cart/cart.controller';
import { OrderController } from './order/order.controller';

@Module({
  imports: [
    ServiceModule,
  ],
  controllers: [
    GoodsController,
    CategoryController,
    CartController,
    OrderController,
  ]
})
export class FrontModule { }
