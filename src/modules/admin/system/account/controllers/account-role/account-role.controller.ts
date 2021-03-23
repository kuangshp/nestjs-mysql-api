import { Controller, UseGuards, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import adminConfig from '@src/config/admin.config';
import { AccountRoleService } from '../../services/account-role/account-role.service';
import { AccountRoleListResDto } from './dto/account.role.res.dto';

@ApiTags('后台管理系统-账号角色管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/account_role`)
export class AccountRoleController {
  constructor(
    private readonly accountRoleService: AccountRoleService,
  ) {}

  @ApiOperation({ summary: '获取角色列表', description: '根据当前的账号id获取角色已经授权的角色' })
  @Get(':accountId')
  @HttpCode(HttpStatus.OK)
  async accountRoleListByAccountId(
    @Param('accountId', new ParseIntPipe()) accountId: number
  ): Promise<AccountRoleListResDto[] | undefined> {
    return this.accountRoleService.accountRoleListByAccountId(accountId);
  }
}
