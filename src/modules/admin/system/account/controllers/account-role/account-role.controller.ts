import {
  Controller,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { AccountRoleService } from '../../services/account-role/account-role.service';
import { AccountRoleListVo, RoleAccountListVo } from './vo/account.role.vo';
import { DistributionRoleDto } from './dto/distribution.role.dto';
import { ApiAuth } from '@src/decorators/api.auth';
import { PermissionModule } from '@src/modules/common/collections-permission/decorators/permission.module';
import { PermissionMeta } from '@src/modules/common/collections-permission/decorators/permission.meta';

@ApiTags('后台管理系统-账号角色管理')
@PermissionModule('账号角色管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('account_role')
export class AccountRoleController {
  constructor(private readonly accountRoleService: AccountRoleService) {}

  @ApiOperation({ summary: '获取角色列表', description: '根据当前的账号id获取角色已经授权的角色' })
  @ApiOkResponse({
    type: AccountRoleListVo,
    isArray: true,
    description: '根据账号ID查询授权角色返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':accountId')
  async accountRoleListByAccountId(
    @Param('accountId', new ParseIntPipe()) accountId: number,
  ): Promise<AccountRoleListVo[] | undefined> {
    return this.accountRoleService.accountRoleListByAccountId(accountId);
  }

  @ApiOperation({ summary: '给账号分配角色', description: '给当前账号分配角色' })
  @ApiOkResponse({
    type: String,
    description: '给账号授权角色返回值',
  })
  @PermissionMeta('给账号分配角色')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async distributionRole(@Body() distributionRoleDto: DistributionRoleDto): Promise<string> {
    return await this.accountRoleService.distributionRole(distributionRoleDto);
  }

  @ApiOperation({ summary: '根据全部的角色', description: '给账号分配角色的时候使用' })
  @ApiOkResponse({
    type: RoleAccountListVo,
    isArray: true,
    description: '角色返回列表',
  })
  @Get()
  async roleList(): Promise<RoleAccountListVo[]> {
    return await this.accountRoleService.roleList();
  }
}
