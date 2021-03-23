import { Controller, Get, Body, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';
import { ApiOperation, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create.account.dto';
import { AccountService } from '../../services/account/account.service';

@ApiTags('后台管理系统-账号管理')
@Controller(`${adminConfig.adminPath}/account`)
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}

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
  ):Promise<string> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOperation({summary: '删除账号',description: '根据id删除账号'})
  @Delete(':id')
  async destroyById(
    @Param('id', new ParseIntPipe()) id: number,
  ):Promise<string> {
    return await this.accountService.destroyById(id);
  }
}
