import { Controller, Post, Body, HttpCode, UseInterceptors, HttpStatus, UploadedFile, HttpException, Delete, Param, Patch, Get, Query } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UploadFileService } from '@src/module/file/upload-file/upload-file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateGoodsDto } from './dto/create.goods.dto';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { GoodsRep } from './dto/goods.rep.dto';
import { GoodsService } from '@src/service/front/goods/goods/goods.service';
import { ParseIdAndUuidPipe } from '@src/pipe/parse.idanduuid.pipe';
import { UpdateGoodsDto } from './dto/update.goods.dto';
import { ObjectType } from '@src/types';

@ApiTags('商品模块')
@ApiBearerAuth()
@Controller(`${adminConfig.adminPath}/goods`)
export class GoodsController {
  constructor (
    @InjectConfig() private readonly configService: ConfigService,
    private readonly uploadFileService: UploadFileService,
    private readonly goodsService: GoodsService,
  ) { }


  @ApiOperation({ summary: '上传图片', description: '上传图片的接口' })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @Post('upload_image')
  async uploadImage(@UploadedFile() file: any): Promise<any> {
    const supportImgTypes = this.configService.get('admin.supportImgTypes');
    const result = await this.uploadFileService.uploadFile({
      files: file,
      category: 'goods',
      typeList: supportImgTypes,
    })
    return { link: `http://localhost:3000${result.url}`, isUploaded: true };
  }


  @ApiOperation({ summary: '添加商品', description: '传递数据添加商品' })
  @ApiCreatedResponse({
    type: CreateGoodsDto,
    description: '创建商品DTO'
  })
  @ApiOkResponse({ type: GoodsRep })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createGoods(@Body() createGoods: any): Promise<GoodsRep> {
    try {
      const goods = await this.goodsService.create(createGoods);
      await this.goodsService.save(goods);
      return goods;
    } catch (e) {
      throw new HttpException(`创建数据失败:${e}`, HttpStatus.OK);
    }
  }

  @ApiOperation({ summary: '删除商品', description: '根据id删除商品' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteGoods(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<string> {
    const { affected } = await this.goodsService.deleteById(id);
    if (affected) {
      return `成功删除${id}数据`;
    } else {
      return `删除数据${id}失败`;
    }
  }

  @ApiOperation({ summary: '修改商品', description: '输入商品id修改商品' })
  @ApiCreatedResponse({
    type: UpdateGoodsDto,
    description: '修改商品DTO'
  })
  @ApiOkResponse({ type: GoodsRep })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateGoods(@Param('id', new ParseIdAndUuidPipe()) id: string, @Body() updateGoods: UpdateGoodsDto): Promise<GoodsRep> {
    return await this.goodsService.updateById(id, updateGoods);;
  }

  @ApiOperation({ summary: '查询全部的商品', description: '支持分页查询商品' })
  @ApiOkResponse({ type: [GoodsRep] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async goods(@Query() querOption: ObjectType): Promise<GoodsRep[]> {
    return await this.goodsService.findPage(querOption);
  }

  @ApiOperation({ summary: '查询一个商品', description: '根据id查询一条数据' })
  @ApiOkResponse({ type: GoodsRep })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async goodsOne(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<GoodsRep> {
    return await this.goodsService.findById(id);
  }
}
