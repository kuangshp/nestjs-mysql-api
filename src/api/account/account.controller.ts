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

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccountApi(
    @Body() req: AccountDto,
    @CurrentUser() currentInfo: ICurrentUserType,
    request: Request
  ): Promise<string> {
    return await this.accountService.createAccountApi(req, request, currentInfo);
  }

  @Delete(':id')
  async deleteAccountByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.accountService.deleteAccountByIdApi(id);
  }

  @Put('/status/:id')
  async modifyAccountStatusByIdApi(@Param('id', new ParseIntPipe()) id: number): Promise<string> {
    return await this.accountService.modifyAccountStatusByIdApi(id);
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
    @CurrentUser() currentInfo: ICurrentUserType
  ): Promise<AccountPageVo> {
    return await this.accountService.getAccountPageApi(queryOption, currentInfo);
  }

  @Get(':id')
  async getAccountByIdApi(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<AccountVo | undefined> {
    return await this.accountService.getAccountByIdApi(id);
  }
}