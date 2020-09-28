import { Controller, UseGuards, Post, HttpCode, HttpStatus, Body, Delete, Param, Patch, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth.guard';
import adminConfig from '@src/config/admin.config';
import { RoleService } from '@src/services/admin/system/role/role.service';
import { CreateRoleDto } from './dto/create.role.dto';
import { RoleRep } from './dto/role.rep.dto';
import { UpdateRoleDto } from './dto/update.role.dto';
import { ObjectType } from '@src/types';

@ApiTags('角色模块')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/role`)
export class RoleController {
  constructor (
    private readonly roleService: RoleService,
  ) { }

  @ApiOperation({ summary: '创建角色', description: '输入角色名称' })
  @ApiCreatedResponse({
    type: CreateRoleDto,
    description: '创建角色DTO'
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRole(
    @Body() createRoleDto: CreateRoleDto
  ): Promise<string> {
    return await this.roleService.createRole(createRoleDto);;
  }


  @ApiOperation({ summary: '删除角色', description: '根据角色id删除角色' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<string> {
    return await this.roleService.deleteById(id);
  }


  @ApiOperation({ summary: '修改角色', description: '根据角色id修改数据' })
  @ApiCreatedResponse({
    type: UpdateRoleDto,
    description: '修改角色DTO'
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<string> {
    return await this.roleService.updateById(id, updateRoleDto);
  }

  @ApiOperation({ summary: '查询某一个角色', description: '输入角色id或者uuid查询角色' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<RoleRep> {
    return await this.roleService.findById(id);
  }

  @ApiOperation({ summary: '查询全部角色', description: '分页查询全部的角色' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async roleList(
    @Query() queryOption: ObjectType
  ): Promise<RoleRep[]> {
    return await this.roleService.roleList(queryOption);
  }
}
