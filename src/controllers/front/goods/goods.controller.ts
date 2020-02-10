import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { GoodsService } from '@src/service/front/goods/goods/goods.service';
import { GoodsRep } from '@src/controllers/admin/goods/goods/dto/goods.rep.dto';
import { ParseIdAndUuidPipe } from '@src/pipe/parse.idanduuid.pipe';

@ApiTags('前端商品模块')
@Controller(`${adminConfig.frontPath}/goods`)
export class GoodsController {
  constructor (
    private readonly goodsService: GoodsService,
  ) { }


  @ApiOperation({ summary: '查询全部的商品', description: '查询全部的商品' })
  @ApiOkResponse({ type: [GoodsRep] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async goodsList(): Promise<any> {
    return this.goodsService.goodsList();
  }

  @ApiOperation({ summary: '根据id查询商品详情', description: '输入id或者uuid查询商品详情信息' })
  @ApiOkResponse({ type: GoodsRep })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async goodsDetails(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<any> {
    return this.goodsService.goodsDetails(id);
  }
}
