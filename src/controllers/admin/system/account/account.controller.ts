import { Controller, UseGuards, Post, HttpCode, HttpStatus, Body, Delete, Param, Patch, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/guard/auth.guard';
import adminConfig from '@src/config/admin.config';
import { ObjectType } from '@src/types';
import { AccountService } from '@src/services/admin/system/account/account.service';
import { CreateAccountDto } from './dto/create.account.dto';
import { CurrentUser } from '@src/decorators/current.user';
import { UpdateAccountDto } from './dto/update.account.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';

@ApiTags('账号模块')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/account`)
export class AccountController {
  constructor (
    private readonly accountService: AccountService,
  ) { }


  @ApiOperation({ summary: '创建账号', description: '输入账号名及密码' })
  @ApiCreatedResponse({
    type: CreateAccountDto,
    description: '创建账号DTO'
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body() createAccountDto: CreateAccountDto
  ): Promise<string> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOperation({ summary: '删除账号', description: '根据账号id删除账号' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async deleteAccountById(
    @CurrentUser('id') userId: string,
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<string> {
    return await this.accountService.deleteAccountById(userId, id);
  }


  @ApiOperation({ summary: '修改账号自己密码', description: '传递新老密码修改密码' })
  @Patch('modify_password')
  @HttpCode(HttpStatus.OK)
  async modifyPassword(
    @CurrentUser('id') id: string,
    @Body() data: UpdatePasswordDto
  ): Promise<any> {
    return await this.accountService.modifyPassword(id, data);
  }


  @ApiOperation({ summary: '重置账号密码', description: '传递账号id就可以,默认密码是123456' })
  @Patch('reset_password/:id')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<any> {
    return await this.accountService.resetPassword(id);
  }


  @ApiOperation({ summary: '修改账号信息', description: '根据id修改账号信息' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() data: UpdateAccountDto
  ): Promise<any> {
    return await this.accountService.updateById(id, data);
  }


  @ApiOperation({ summary: '获取账号信息', description: '根据id查询账号信息' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<any> {
    return await this.accountService.findById(id);
  }


  @ApiOperation({ summary: '账号列表', description: '获取账号列表' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async accountList(
    @Query() queryOption: ObjectType
  ): Promise<any> {
    return await this.accountService.accountList(queryOption);;
  }
}
