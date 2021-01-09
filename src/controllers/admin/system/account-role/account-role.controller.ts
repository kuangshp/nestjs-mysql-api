import { Controller, UseGuards, Get, HttpCode, Param, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth.guard';
import adminConfig from '@src/config/admin.config';
import { AccountRoleService } from '@src/services/admin/system/account-role/account-role.service';

@ApiTags('账号与角色模块')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/account_role`)
export class AccountRoleController {
  constructor (
    private readonly accountRoleService: AccountRoleService,
  ) { }

  @ApiOperation({ summary: '获取角色', description: '根据当前的账号id获取角色已经授权的角色' })
  @Get(':accountId')
  @HttpCode(HttpStatus.OK)
  async accountRoleList(
    @Param('accountId', new ParseIntPipe()) accountId: number
  ): Promise<any> {
    return this.accountRoleService.accountRoleList(accountId);
  }
}
