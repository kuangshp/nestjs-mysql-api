import { Controller, UseGuards, Get, Param, ParseIntPipe, Body, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { RoleAccessService } from '../../services/role-access/role-access.service';
import { RoleAccessReqDto } from './dto/role.access.req.dto';
import { AllApiVo } from './vo/all.api.vo';
import { ApiAuth } from '@src/decorators/api.auth';
import { AllMenusVo } from './vo/all.menus.vo';
import { RoleAccessVo } from './vo/role.access.vo';
import { PermissionModule } from '@src/modules/common/collections-permission/decorators/permission.module';
import { PermissionMeta } from '@src/modules/common/collections-permission/decorators/permission.meta';

@ApiTags('后台管理系统-角色资源管理')
@PermissionModule('角色资源管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('role_access')
export class RoleAccessController {
  constructor(private readonly roleAccessService: RoleAccessService) {}

  @ApiOperation({
    summary: '给角色分配菜单资源',
    description: '根据角色ID给当前角色分配菜单或接口资源',
  })
  @ApiOkResponse({
    type: String,
    description: '给当前角色分配菜单或接口资源返回值',
  })
  @PermissionMeta('给当前角色分配菜单')
  @Patch('menus/:roleId')
  async roleToAccess(
    @Param('roleId', new ParseIntPipe()) roleId: number,
    @Body() roleAccessReqDto: RoleAccessReqDto,
  ): Promise<string> {
    return await this.roleAccessService.roleToAccess(roleId, roleAccessReqDto);
  }

  @ApiOperation({
    summary: '获取全部的菜单',
    description: '获取全部的菜单(可授权)',
  })
  @Get('all_menus')
  async allMenus(): Promise<AllMenusVo[]> {
    return await this.roleAccessService.allMenus();
  }

  @ApiOperation({
    summary: '获取全部的API',
    description: '获取全部的API(可授权)',
  })
  @Get('all_api')
  async allApi(): Promise<AllApiVo[]> {
    return await this.roleAccessService.allApi();
  }

  @ApiOperation({
    summary: '获取资源',
    description: '根据角色ID获取已经分配的菜单或接口',
    externalDocs: {
      url: 'xxx/角色id/type=(2:菜单,3:接口)',
    },
  })
  @ApiOkResponse({
    type: RoleAccessVo,
    isArray: true,
    description: '根据角色ID返回授权的资源列表',
  })
  @Get(':roleId/:type')
  async accessListByRoleId(
    @Param('roleId', new ParseIntPipe()) roleId: number,
    @Param('type', new ParseIntPipe()) type: number,
  ): Promise<RoleAccessVo[]> {
    return await this.roleAccessService.accessListByRoleId(roleId, type);
  }
}
