import { Controller, Get } from '@nestjs/common';

@Controller('account')
export class AccountController {
  @Get()
  test1() {
    return '测试代码';
  }
}
