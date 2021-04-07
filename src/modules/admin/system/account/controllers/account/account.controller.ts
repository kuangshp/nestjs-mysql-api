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
import adminConfig from '@src/config/admin.config';
import { ApiOperation, ApiCreatedResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create.account.dto';
import { AccountService } from '../../services/account/account.service';
import { UpdateAccountDto } from './dto/update.account.dto';
import { ModifyPasswordDto } from './dto/modify.password.dto';
import { AuthGuard } from '@src/guard/auth/auth.guard';
import { AccountResDto, AccountListResDtoDto } from './dto/account.res.dto';
import { AccountReqDto } from './dto/account.req.dto';
import { CurrentUser, ICurrentUserType } from '@src/decorators/current.user';
import { ApiAuth } from '@src/decorators/api.auth';

@ApiTags('后台管理系统-账号管理')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiAuth()
@Controller(`${adminConfig.adminPath}/account`)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary: '创建账号',
    description: '创建账号',
  })
  @ApiCreatedResponse({
    type: String,
    description: '创建账号返回值',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<string> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @ApiOperation({ summary: '重置为默认密码', description: '根据id重置默认密码' })
  @ApiCreatedResponse({ type: String, description: '重置密码返回值' })
  @HttpCode(HttpStatus.OK)
  @Post('reset_password')
  async resetPassword(@Body() data: { id: number }): Promise<string> {
    const { id } = data;
    return await this.accountService.resetPassword(id);
  }

  @ApiOperation({ summary: '修改密码', description: '根据账号自己的密码' })
  @ApiCreatedResponse({
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
  @ApiCreatedResponse({
    type: String,
    description: '修改账号返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async destroyById(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.accountService.destroyById(id);
  }

  @ApiOperation({ summary: '修改账号信息', description: '根据账号id修改账号信息' })
  @ApiCreatedResponse({
    type: String,
    description: '修改账号返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async modifyById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<string> {
    return await this.accountService.modifyById(id, updateAccountDto);
  }

  @ApiOperation({ summary: '查询账号信息', description: '根据账号id查询账号信息' })
  @ApiCreatedResponse({
    type: AccountResDto,
    description: '查询单条账号返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async accountById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<AccountResDto | undefined> {
    return await this.accountService.accountById(id);
  }

  @ApiOperation({
    summary: '查询账号列表',
    description: '根据条件查询账号列表',
    externalDocs: {
      url: 'xx?pageSize=10&pageNumber=1&username=xx&email=xx&mobile=xx&status=0&platform=1',
    },
  })
  @ApiCreatedResponse({
    type: AccountResDto,
    isArray: true,
    description: '分页查询账号返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async accountList(@Query() accountReqDto: AccountReqDto): Promise<AccountListResDtoDto> {
    return await this.accountService.accountList(accountReqDto);
  }
}
