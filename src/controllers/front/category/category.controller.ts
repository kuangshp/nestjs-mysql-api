import { Controller, Get, HttpCode, HttpStatus, Query, Param } from '@nestjs/common';
import { CategoryService } from '@src/service/front/goods/category/category.service';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryRep } from '@src/controllers/admin/goods/category/dto/category.rep.tdo';
import { ParseIdAndUuidPipe } from '@src/pipe/parse.idanduuid.pipe';
import { ObjectType } from '@src/types';
import adminConfig from '@src/config/admin.config';

@ApiTags('前端商品分类模块')
@Controller(`${adminConfig.frontPath}/category`)
export class CategoryController {
  constructor (
    private readonly categoryService: CategoryService,
  ) { }

  @ApiOperation({ summary: '查询全部的分类', description: '支持分页查询分类' })
  @ApiOkResponse({ type: [CategoryRep] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async category(): Promise<CategoryRep[]> {
    return await this.categoryService.categoryList();
  }

  @ApiOperation({ summary: '查询一个分类', description: '根据id查询一条数据' })
  @ApiOkResponse({ type: CategoryRep })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async categoryOne(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<CategoryRep> {
    return await this.categoryService.findById(id);
  }
}
