import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './dto/account.dto';
import { AuthGuard } from '@src/guard/auth.guard';
import { CurrentUser, ICurrentUserType } from '@src/decorators';
import { Request } from 'express';
import { AccountPageVo, AccountVo } from './vo/account.vo';
import { QueryAccountDto } from './dto/account.query';
import { AccountEntity } from './entities/account.entity';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccountApi(
    @Body() req: AccountDto,
    @CurrentUser('userInfo') currentInfo: ICurrentUserType,
    request: Request
  ): Promise<string> {
    return await this.accountService.createAccountApi(req, request, currentInfo);
  }

  @Delete(':id')
  async deleteAccountByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.accountService.deleteAccountByIdApi(id, currentUser);
  }

  @Put('/status/:id')
  async modifyAccountStatusByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.accountService.modifyAccountStatusByIdApi(id, currentUser);
  }

  @Put(':id')
  async modifyAccountByIdApi(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() req: AccountDto
  ): Promise<string> {
    return await this.accountService.modifyAccountByIdApi(id, req);
  }

  @Get()
  async getAccountPageApi(
    @Query() queryOption: QueryAccountDto,
    @CurrentUser('userInfo') currentInfo: ICurrentUserType
  ): Promise<AccountPageVo> {
    return await this.accountService.getAccountPageApi(queryOption, currentInfo);
  }

  @Get('list')
  async getAccountListApi(
    @CurrentUser('userInfo') currentInfo: ICurrentUserType,
    @Query('status') status: number
  ): Promise<Pick<AccountEntity, 'id' | 'username'>[]> {
    return await this.accountService.getAccountListApi(currentInfo, status);
  }

  @Get(':id')
  async getAccountByIdApi(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AccountVo | undefined> {
    return await this.accountService.getAccountByIdApi(id);
  }

  @Post('delete')
  async batchDeleteAccountByIdListApi(
    @Body() idList: number[],
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.accountService.batchDeleteAccountByIdListApi(idList, currentUser);
  }

  @Post('/batchStatus')
  async batchModifyAccountStatusByIdApi(
    @Body() idList: number[],
    @CurrentUser('userInfo') currentUser: ICurrentUserType
  ): Promise<string> {
    return await this.accountService.batchModifyAccountStatusByIdApi(idList, currentUser);
  }
}
