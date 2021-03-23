import { Controller, UseGuards, Post, Body, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import adminConfig from '@src/config/admin.config';
import { RoleService } from '../../services/role/role.service';
import { CreateRoleDto } from './dto/create.role.dto';

@ApiTags('后台管理系统-角色管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/role`)
export class RoleController {
  constructor (
    private readonly roleService: RoleService,
  ) { }

  @ApiOperation({
    summary: '创建角色',
    description: '创建角色',
  })
  @ApiCreatedResponse({
    type: CreateRoleDto,
    description: '创建角色DTO'
  })
  @Post()
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<string> {
    return await this.roleService.createRole(createRoleDto);
  }

  @ApiOperation({summary: '删除角色', description: '根据角色id删除角色'})
  @Delete(':id')
  async destroyRoleById(
    @Param('id', new ParseIntPipe()) id: number,
  ):Promise<string> {
    return await this.roleService.destroyRoleById(id);
  }
}
