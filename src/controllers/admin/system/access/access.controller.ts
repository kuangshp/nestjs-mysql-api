import { Controller, Get, HttpCode, HttpStatus, Query, Body, Post, Delete, Param, Patch, Headers, ParseIntPipe } from '@nestjs/common';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import adminConfig from '@src/config/admin.config';
import { AccessService } from '@src/service/admin/access/access.service';
import { CreateAccessDto } from './dto/create.access.dto';
import { ParseIdAndUuidPipe } from '@src/pipe/parse.idanduuid.pipe';
import { UpdateAccessDto } from './dto/update.access.dto';
import { AccessRep } from './dto/access.rep.dto';
import { ObjectType } from '@src/types';
import { CurrentUser } from '@src/decorators/current.user';

@ApiTags('资源模块')
@ApiBearerAuth()
@Controller(`${adminConfig.adminPath}/access`)
export class AccessController {
  constructor (private readonly accessService: AccessService) { }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 18:59:12
   * @LastEditors: 水痕
   * @Description: 获取全部的权限
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '权限列表', description: '获取权限列表' })
  @ApiOkResponse({ type: [AccessRep] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async accessList(@Headers() headers: any, @Query() querOption: { [propsName: string]: any }): Promise<any[]> {
    return await this.accessService.findPage(querOption);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 19:09:40
   * @LastEditors: 水痕
   * @Description: 创建权限
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '创建权限', description: '创建权限' })
  @ApiOkResponse({ type: AccessRep })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAccessDto: CreateAccessDto): Promise<AccessRep> {
    return await this.accessService.create(createAccessDto);;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 19:12:06
   * @LastEditors: 水痕
   * @Description: 根据id删除数据
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '删除权限', description: '删除权限' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<string> {
    const result = await this.accessService.deleteById(id);
    if (result) {
      return `成功删除${id}数据`;
    } else {
      return `删除${id}失败`;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 19:14:14
   * @LastEditors: 水痕
   * @Description: 修改权限
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '修改权限', description: '根据id或uuid修改权限' })
  @ApiOkResponse({ type: AccessRep })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id', new ParseIdAndUuidPipe()) id: string, @Body() data: UpdateAccessDto): Promise<AccessRep> {
    return await this.accessService.updateById(id, data);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-27 13:05:59
   * @LastEditors: 水痕
   * @Description: 获取全部的模块
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '全部的模块、菜单列表', description: '获取模块或菜单' })
  @ApiOkResponse({ type: AccessRep })
  @Get('module/:type')
  @HttpCode(HttpStatus.OK)
  async moduleList(@Param('type') type: string): Promise<any> {
    return this.accessService.moduleList(type);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-29 11:16:25
   * @LastEditors: 水痕
   * @Description: 获取菜单列表
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '全部的菜单列表', description: '获取菜单' })
  @ApiOkResponse({ type: AccessRep })
  @Get('menus')
  @HttpCode(HttpStatus.OK)
  async menusList(@CurrentUser() userInfo: ObjectType): Promise<AccessRep[]> {
    return this.accessService.menusList(userInfo);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-29 11:17:30
   * @LastEditors: 水痕
   * @Description: 获取角色权限
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '获取角色权限', description: '根据类别获取角色权限,type:1表示菜单,2表示接口,roleId:当前点击行的id' })
  @ApiOkResponse({ type: AccessRep })
  @Get('authorization/:type/:roleId')
  @HttpCode(HttpStatus.OK)
  async authorizationList(
    @Param('type', new ParseIntPipe()) type: number,
    @Param('roleId', new ParseIntPipe()) roleId: number
  ): Promise<AccessRep[]> {
    return this.accessService.authorizationList(type, roleId);
  }
}
