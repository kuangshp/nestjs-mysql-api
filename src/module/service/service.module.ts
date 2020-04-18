import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@src/entities/user.entity';
import { RoleAccessEntity } from '@src/entities/role_access.entity';
import { AccessEntity } from '@src/entities/access.entity';
import { RoleEntity } from '@src/entities/role.entity';

import { UserService } from '@src/service/admin/user/user.service';
import { ToolsService } from '@src/service/tools/tools.service';
import { RoleAccessService } from '@src/service/admin/role-access/role-access.service';
import { AccessService } from '@src/service/admin/access/access.service';
import { RoleService } from '@src/service/admin/role/role.service';
import { AuthService } from '@src/service/auth/auth.service';
import { GoodsService } from '@src/service/front/goods/goods/goods.service';
import { CategoryService } from '@src/service/front/goods/category/category.service';
import { GoodsEntity } from '@src/entities/goods.entity';
import { GoodsCategoryEntity } from '@src/entities/goods_category.entity';
import { CartService } from '@src/service/front/goods/cart/cart.service';
import { OrderService } from '@src/service/front/goods/order/order.service';
import { CartEntity } from '@src/entities/cart.entity';
import { OrderListEntity } from '@src/entities/order_list.entity';
import { OrderInfoEntity } from '@src/entities/order_info.entity';
import { OrderInfoService } from '@src/service/front/goods/order-info/order-info.service';
import { UserRoleEntity } from '@src/entities/user_role.entity';
import { UserRoleService } from '@src/service/admin/user-role/user-role.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AccessEntity,
      RoleAccessEntity,
      RoleEntity,
      GoodsEntity,
      GoodsCategoryEntity,
      CartEntity,
      OrderListEntity,
      OrderInfoEntity,
      UserRoleEntity,
    ])
  ],
  providers: [
    UserService,
    ToolsService,
    AccessService,
    RoleService,
    RoleAccessService,
    UserRoleService,
    AuthService,
    GoodsService,
    CategoryService,
    CartService,
    OrderService,
    OrderInfoService,
    UserRoleService,
  ],
  exports: [
    UserService,
    ToolsService,
    AccessService,
    RoleService,
    RoleAccessService,
    UserRoleService,
    AuthService,
    GoodsService,
    CategoryService,
    CartService,
    OrderService,
    OrderInfoService,
    UserRoleService,
  ]
})
export class ServiceModule { }
