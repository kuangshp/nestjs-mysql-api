import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@src/guard/auth.guard';
import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/account.dto';
import { QueryAccountDto } from './dto/account.query.dto';
import { AccountListVo, LoginHistoryListVo } from './vo/account.vo';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(@Body() createAccountDto: CreateAccountDto): Promise<string> {
    return await this.accountService.createAccount(createAccountDto);
  }

  @Delete(':accountId')
  async deleteAccountById(
    @Param('accountId', new ParseIntPipe()) accountId: number
  ): Promise<string> {
    return await this.accountService.deleteAccountById(accountId);
  }

  @Patch('status/:accountId')
  async modifyStatusById(
    @Param('accountId', new ParseIntPipe()) accountId: number
  ): Promise<string> {
    return await this.accountService.modifyStatusById(accountId);
  }

  @Get('loginHistory/:accountId')
  async getLoginHistoryByAccountId(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Query() queryOptions: QueryOptionsDto
  ): Promise<LoginHistoryListVo> {
    return await this.accountService.getLoginHistoryByAccountId(accountId, queryOptions);
  }

  @Get()
  async getAccountPage(@Query() queryOptions: QueryAccountDto): Promise<AccountListVo> {
    return await this.accountService.getAccountPage(queryOptions);
  }
}
