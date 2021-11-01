import {
  Controller,
  Get,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create.account.dto';
import { AccountService } from '../../services/account/account.service';
import { UpdateAccountDto } from './dto/update.account.dto';
import { ModifyPasswordDto } from './dto/modify.password.dto';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { AccountVo, AccountListVo } from './vo/account.vo';
import { AccountReqDto } from './dto/account.req.dto';
import { CurrentUser, ICurrentUserType } from '@src/decorators/current.user';
import { ApiAuth } from '@src/decorators/api.auth';
import { PermissionModule } from '@src/modules/common/collections-permission/decorators/permission.module';
import { PermissionMeta } from '@src/modules/common/collections-permission/decorators/permission.meta';

@ApiTags('后台管理系统-账号管理')
@PermissionModule('账号管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary: '创建账号',
    description: '创建账号',
  })
  @ApiOkResponse({
    type: String,
    description: '创建账号返回值',
  })
  @HttpCode(HttpStatus.CREATED)
  @PermissionMeta('创建账号')
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<string> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOperation({ summary: '重置为默认密码', description: '根据id重置默认密码' })
  @ApiOkResponse({ type: String, description: '重置密码返回值' })
  @HttpCode(HttpStatus.OK)
  @Post('reset_password')
  async resetPassword(@Body() data: { id: number }): Promise<string> {
    const { id } = data;
    return await this.accountService.resetPassword(id);
  }

  @ApiOperation({ summary: '修改密码', description: '根据账号自己的密码' })
  @ApiOkResponse({
    type: String,
    description: '修改账号密码返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Post('modify_password')
  async modifyPassWordById(
    @CurrentUser() userInfo: ICurrentUserType,
    @Body() modifyPasswordDto: ModifyPasswordDto,
  ): Promise<string> {
    const { id } = userInfo;
    return await this.accountService.modifyPassWordById(id, modifyPasswordDto);
  }

  @ApiOperation({ summary: '删除账号', description: '根据id删除账号' })
  @ApiOkResponse({
    type: String,
    description: '修改账号返回值',
  })
  @PermissionMeta('删除账号')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async destroyById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.accountService.destroyById(id);
  }

  @ApiOperation({ summary: '修改账号信息', description: '根据账号id修改账号信息' })
  @ApiOkResponse({
    type: String,
    description: '修改账号返回值',
  })
  @PermissionMeta('根据id修改账号信息')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async modifyById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<string> {
    return await this.accountService.modifyById(id, updateAccountDto);
  }

  @ApiOperation({ summary: '查询账号信息', description: '根据账号id查询账号信息' })
  @ApiOkResponse({
    type: AccountVo,
    description: '查询单条账号返回值',
  })
  @PermissionMeta('根据id查询单条账号信息')
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async accountById(@Param('id', new ParseIntPipe()) id: number): Promise<AccountVo | undefined> {
    return await this.accountService.accountById(id);
  }

  @ApiOperation({
    summary: '查询账号列表',
    description: '根据条件查询账号列表',
    externalDocs: {
      url: 'xx?pageSize=10&pageNumber=1&username=xx&email=xx&mobile=xx&status=0&platform=1',
    },
  })
  @ApiOkResponse({
    type: AccountListVo,
    description: '分页查询账号返回值',
  })
  @PermissionMeta('账号列表')
  @HttpCode(HttpStatus.OK)
  @Get()
  async accountList(@Query() accountReqDto: AccountReqDto): Promise<AccountListVo> {
    return await this.accountService.accountList(accountReqDto);
  }
}
