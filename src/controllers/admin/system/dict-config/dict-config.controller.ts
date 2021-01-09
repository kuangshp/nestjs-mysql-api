import { Controller, UseGuards, Body, Post, HttpCode, HttpStatus, Delete, Param, ParseIntPipe, Patch, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth.guard';
import adminConfig from '@src/config/admin.config';
import { DictConfigService } from '@src/services/admin/system/dict-config/dict-config.service';
import { DictConfigEntry } from '@src/entities/model/system/dict.config.entity';
import { CreateDistConfigDto } from './dto/update.dist.conf.dto';
import { UpdateDistConfigDto } from './dto/create.dist.config.dto';
import { ObjectType } from '@src/types';

@ApiTags('数据字典,配置下拉框')
@Controller(`${adminConfig.adminPath}/dict_config`)
export class DictConfigController {
  constructor (
    private readonly dictConfigService: DictConfigService,
  ) { }

  @ApiOperation({ summary: '创建配置', description: '创建配置' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDistConfig(
    @Body() createDistConfigDto: CreateDistConfigDto
  ): Promise<DictConfigEntry> {
    return await this.dictConfigService.createDistConfig(createDistConfigDto);
  }

  @ApiOperation({ summary: '删除配置', description: '根据id删除配置' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async destroy(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<string> {
    return this.dictConfigService.deleteById(id);
  }

  @ApiOperation({ summary: '修改配置', description: '根据id修改配置' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async modifyDistConfig(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateDistConfigDto: UpdateDistConfigDto,
  ): Promise<string> {
    return await this.dictConfigService.updateById(id, updateDistConfigDto);
  }

  @ApiOperation({ summary: '配置列表', description: '获取配置列表' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findPage(
    @Query() queryOption: ObjectType
  ): Promise<any> {
    return await this.dictConfigService.findPage(queryOption);
  }

  @ApiOperation({
    summary: '根据分类获取配置',
    description: '输入分类名称,可以是多个',
    externalDocs: {
      url: 'xx?category=color&category=status'
    }
  })
  @Get('category')
  @HttpCode(HttpStatus.OK)
  async configListByCategory(
    @Query() queryOption: ObjectType
  ): Promise<any[]> {
    const { category } = queryOption;
    return await this.dictConfigService.findByCategory(category);
  }
}
