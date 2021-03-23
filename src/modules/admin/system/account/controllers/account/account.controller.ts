import { Controller, Get, Body, Delete, Param, ParseIntPipe, Post, Patch, UseGuards } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';
import { ApiOperation, ApiCreatedResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create.account.dto';
import { AccountService } from '../../services/account/account.service';
import { UpdateAccountDto } from './dto/update.account.dto';
import { ModifyPasswordDto } from './dto/modify.password.dto';
import { AuthGuard } from '@src/guard/auth/auth.guard';

@ApiTags('后台管理系统-账号管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/account`)
export class AccountController {
  constructor (
    private readonly accountService: AccountService,
  ) { }

  @ApiOperation({
    summary: '创建账号',
    description: '创建账号',
  })
  @ApiCreatedResponse({
    type: CreateAccountDto,
    description: '创建账号DTO'
  })
  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<string> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOperation({ summary: '删除账号', description: '根据id删除账号' })
  @Delete(':id')
  async destroyById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<string> {
    return await this.accountService.destroyById(id);
  }

  @ApiOperation({ summary: '修改密码', description: '根据账号id修改账号密码' })
  @Patch('modify_password/:id')
  async modifyPassWordById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() modifyPasswordDto: ModifyPasswordDto,
  ): Promise<string> {
    return await this.accountService.modifyPassWordById(id, modifyPasswordDto);
  }

  @ApiOperation({ summary: '修改账号信息', description: '根据账号id修改账号信息' })
  @Patch(':id')
  async modifyById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<string> {
    return await this.accountService.modifyById(id, updateAccountDto);
  }
}
