import { Controller, UseGuards, Post, HttpCode, HttpStatus, Body, Delete, Param, Patch, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth.guard';
import adminConfig from '@src/config/admin.config';
import { AccessService } from '@src/services/admin/system/access/access.service';
import { CreateAccessDto } from './dto/create.access.dto';
import { UpdateAccessDto } from './dto/update.access.dto';
import { ObjectType } from '@src/types';

@ApiTags('资源模块')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/access`)
export class AccessController {
  constructor (
    private readonly accessService: AccessService
  ) { }

  @ApiOperation({ summary: '创建资源', description: '创建资源' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccess(
    @Body() createAccessDto: CreateAccessDto
  ): Promise<any> {
    return await this.accessService.createAccess(createAccessDto);
  }


  @ApiOperation({ summary: '删除资源', description: '根据id删除权限' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<string> {
    return await this.accessService.deleteById(id);
  }


  @ApiOperation({ summary: '修改权限', description: '根据id修改权限' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateAccessDto
  ): Promise<any> {
    return await this.accessService.updateById(id, data);
  }

  @ApiOperation({
    summary: '全部的模块',
    description: '获取模块',
  })
  @Get('module')
  @HttpCode(HttpStatus.OK)
  async moduleList(
  ): Promise<any> {
    return this.accessService.moduleList();
  }


  @ApiOperation({ summary: '权限列表', description: '获取权限列表' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async accessList(
    @Query() queryOption: ObjectType
  ): Promise<any[]> {
    return await this.accessService.accessList(queryOption);
  }
}
