import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import adminConfig from '@src/config/admin.config';
import { RoleAccessService } from '../../services/role-access/role-access.service';

@ApiTags('后台管理系统-角色资源管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/role_access`)
export class RoleAccessController {
  constructor (
    private readonly roleAccessService: RoleAccessService
  ) { }

  // @ApiOperation({summary: '给角色分配资源', description: '给当前角色分配资源'})
}
