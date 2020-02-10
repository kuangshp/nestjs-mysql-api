import { Module } from '@nestjs/common';
import { UserController } from './system/user/user.controller';
import { LoginController } from './login/login.controller';
import { ServiceModule } from '@src/module/service/service.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@src/guard/auth.guard';
import { RoleController } from './system/role/role.controller';
import { AccessController } from './system/access/access.controller';
import { CategoryController } from './goods/category/category.controller';
import { GoodsController } from './goods/goods/goods.controller';
import { FileModule } from '@src/module/file/file.module';
import { OrderController } from './goods/order/order.controller';

@Module({
  imports: [
    ServiceModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [
    UserController,
    LoginController,
    RoleController,
    AccessController,
    CategoryController,
    GoodsController,
    OrderController
  ]
})
export class AdminModule { }
