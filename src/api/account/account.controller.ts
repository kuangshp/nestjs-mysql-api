import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/guard/auth.guard';
import { AccountService } from './account.service';

@UseGuards(AuthGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccountPage(): Promise<any> {
    return await this.accountService.getAccountPage();
  }
}
