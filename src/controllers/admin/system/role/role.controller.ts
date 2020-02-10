import { Controller, Post, HttpStatus, HttpCode, Body, Param, Delete, Patch, Get, Query, ParseIntPipe } from '@nestjs/common';

import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import adminConfig from '@src/config/admin.config';
import { RoleService } from '@src/service/admin/role/role.service';
import { ParseIdAndUuidPipe } from '@src/pipe/parse.idanduuid.pipe';
import { UserService } from '@src/service/admin/user/user.service';
import { RoleAccessService } from '@src/service/admin/role-access/role-access.service';

import { UpdateRoleDto } from './dto/update.role.dto';
import { AssiginAccessDto } from './dto/assigin_access.dto';
import { CreateRoleDto } from './dto/create.role.dto';
import { RoleRep } from './dto/role.rep.dto';

@ApiTags('角色模块')
@ApiBearerAuth()
@Controller(`${adminConfig.adminPath}/role`)
export class RoleController {
  constructor (
    private roleService: RoleService
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 15:50:28
   * @LastEditors: 水痕
   * @Description: 添加角色
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '创建角色', description: '输入角色名称' })
  @ApiCreatedResponse({
    type: CreateRoleDto,
    description: '创建角色DTO'
  })
  @ApiOkResponse({ type: RoleRep })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleRep> {
    const role = await this.roleService.create(createRoleDto);
    await this.roleService.save(role);
    return role;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 15:54:24
   * @LastEditors: 水痕
   * @Description: 删除数据
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '删除角色', description: '输入角色名称' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<string> {
    const { affected } = await this.roleService.deleteById(id);
    if (affected) {
      return `成功删除${id}数据`;
    } else {
      return `删除数据${id}失败`;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 16:13:26
   * @LastEditors: 水痕
   * @Description: 更新角色
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '修改角色', description: '输入角色名称' })
  @ApiCreatedResponse({
    type: UpdateRoleDto,
    description: '修改角色DTO'
  })
  @ApiOkResponse({ type: RoleRep })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateRole(@Param('id', new ParseIdAndUuidPipe()) id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleRep> {
    return await this.roleService.updateById(id, updateRoleDto);;
  }


  /**
   * @Author: 水痕
   * @Date: 2020-01-23 16:14:48
   * @LastEditors: 水痕
   * @Description: 查询单个角色
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '查询某一个角色', description: '输入角色id查询角色' })
  @ApiOkResponse({ type: RoleRep })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<RoleRep> {
    return await this.roleService.findById(id);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 19:23:26
   * @LastEditors: 水痕
   * @Description: 分页查询全部的角色
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '查询全部角色', description: '查询全部的角色' })
  @ApiOkResponse({ type: [RoleRep] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async roleList(@Query() querOption: { [propsName: string]: any }): Promise<RoleRep[]> {
    return await this.roleService.findPage(querOption);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 20:37:03
   * @LastEditors: 水痕
   * @Description: 给角色分配资源
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '给角色分配权限', description: '传递roleId和accessList数组' })
  @Post('assigin_access')
  @HttpCode(HttpStatus.OK)
  async assignAccess(@Body() body: AssiginAccessDto): Promise<any> {
    return await this.roleService.assignAccess(body);
  }
}
