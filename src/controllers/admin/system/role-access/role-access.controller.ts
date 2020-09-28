import { Controller, HttpCode, HttpStatus, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import adminConfig from '@src/config/admin.config';
import { AuthGuard } from '@src/guard/auth.guard';
import { RoleAccessService } from '@src/services/admin/system/role-access/role-access.service';
import { AccessEntity } from '@src/entities/model/system/access.entity';


@ApiTags('角色资源模块')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/role_access`)
export class RoleAccessController {
  constructor (
    private readonly roleAccessService: RoleAccessService,
  ) { }


  @ApiOperation({
    summary: '获取角色权限',
    description: '根据类别获取角色权限,roleId:当前点击行的id'
  })
  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  async checkedAccessList(
    @Param('roleId', new ParseIntPipe()) roleId: number
  ): Promise<any> {
    return this.roleAccessService.checkedAccessList(roleId);
  }

  @ApiOperation({ summary: '查询全部的资源', description: '查询全部的资源(原始的菜单)' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async accessList(): Promise<AccessEntity[]> {
    return await this.roleAccessService.accessList();
  }
}
