import { Controller, Post, HttpCode, HttpStatus, Body, Delete, Param, Patch, Get, Query } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CategoryService } from '@src/service/front/goods/category/category.service';
import { CreateCategoryDto } from './dto/create.category.dto';
import { CategoryRep } from './dto/category.rep.tdo';
import { ParseIdAndUuidPipe } from '@src/pipe/parse.idanduuid.pipe';
import { UpdateCategoryDto } from './dto/update.category.dto';
import { ObjectType } from '@src/types';

@ApiTags('商品分类模块')
@ApiBearerAuth()
@Controller(`${adminConfig.adminPath}/category`)
export class CategoryController {
  constructor (
    private readonly categoryService: CategoryService,
  ) { }


  /**
   * @Author: 水痕
   * @Date: 2020-01-30 12:27:51
   * @LastEditors: 水痕
   * @Description: 创建分类
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '创建分类', description: '输入分类名称' })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: '创建分类DTO'
  })
  @ApiOkResponse({ type: CategoryRep })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() createRoleDto: CreateCategoryDto): Promise<CategoryRep> {
    const category = await this.categoryService.create(createRoleDto);
    await this.categoryService.save(category);
    return category;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-30 12:30:54
   * @LastEditors: 水痕
   * @Description: 删除分类
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '删除分类', description: '根据id删除分类' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCategory(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<string> {
    const { affected } = await this.categoryService.deleteById(id);
    if (affected) {
      return `成功删除${id}数据`;
    } else {
      return `删除数据${id}失败`;
    }
  }

  @ApiOperation({ summary: '修改分类', description: '输入分类id' })
  @ApiCreatedResponse({
    type: UpdateCategoryDto,
    description: '修改分类DTO'
  })
  @ApiOkResponse({ type: CategoryRep })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCategory(@Param('id', new ParseIdAndUuidPipe()) id: string, @Body() updateCategory: UpdateCategoryDto): Promise<CategoryRep> {
    return await this.categoryService.updateById(id, updateCategory);;
  }

  @ApiOperation({ summary: '查询全部的分类', description: '支持分页查询分类' })
  @ApiOkResponse({ type: [CategoryRep] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async category(@Query() querOption: ObjectType): Promise<CategoryRep[]> {
    return await this.categoryService.findPage(querOption);
  }

  @ApiOperation({ summary: '查询一个分类', description: '根据id查询一条数据' })
  @ApiOkResponse({ type: CategoryRep })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async categoryOne(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<CategoryRep> {
    return await this.categoryService.findById(id);
  }
}
