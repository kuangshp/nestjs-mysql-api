import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/guard/auth.guard';
import { AccountService } from './account.service';
import { QueryAccountDto } from './dto/account.query.dto';
import { AccountListVo } from './vo/account.vo';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccountPage(@Query() queryOptions: QueryAccountDto): Promise<AccountListVo> {
    return await this.accountService.getAccountPage(queryOptions);
  }
}
