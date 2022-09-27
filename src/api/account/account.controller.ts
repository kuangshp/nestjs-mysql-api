import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/guard/auth.guard';
import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';
import { AccountService } from './account.service';
import { QueryAccountDto } from './dto/account.query.dto';
import { AccountListVo, LoginHistoryListVo } from './vo/account.vo';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

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
