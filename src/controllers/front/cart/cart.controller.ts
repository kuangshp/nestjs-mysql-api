import { Controller, Get, HttpCode, HttpStatus, Query, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import adminConfig from '@src/config/admin.config';
import { CartService } from '@src/service/front/goods/cart/cart.service';
import { CartRep } from './dto/cart.rep.dto';
import { ObjectType } from '@src/types';
import { CreateCartDto } from './dto/create.cart.dto';
import { ChangeCartDto } from './dto/change.cart.dto';

@ApiTags('前端商品购物车模块')
@Controller(`${adminConfig.frontPath}/cart`)
export class CartController {
  constructor (
    private readonly cartService: CartService,
  ) { }

  @ApiOperation({ summary: '根据桌子号查询购物车商品', description: '输入桌子号查询购物车商品' })
  @ApiOkResponse({ type: [CartRep] })
  @Get(':tableId')
  @HttpCode(HttpStatus.OK)
  async cartList(@Param('tableId') tableId: string): Promise<CartRep[]> {
    return await this.cartService.cartList(tableId);
  }

  @ApiOperation({ summary: '加入购物车', description: '加入购物车与修改购物车内容' })
  @ApiOkResponse({ type: [CartRep] })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCart(@Body() createCart: CreateCartDto): Promise<CartRep[]> {
    return await this.cartService.createCart(createCart)
  }

  @ApiOperation({ summary: '对购物车数据操作', description: '对购物车数据操作:type=0表示减少,type=1表示增加' })
  @ApiOkResponse({ type: [CartRep] })
  @Post('change_cart')
  @HttpCode(HttpStatus.OK)
  async changeCart(@Body() changeCart: ChangeCartDto): Promise<CartRep[]> {
    return await this.cartService.changeCart(changeCart)
  }

  @ApiOperation({ summary: '根据桌子号获取购物车数量', description: '或者购物车数量' })
  @Get('cart_num/:tableId')
  @HttpCode(HttpStatus.OK)
  async cartNum(@Param('tableId') tableId: string): Promise<number> {
    return await this.cartService.cartNum(tableId);
  }
}
