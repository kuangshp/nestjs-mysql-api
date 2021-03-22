import { Controller, Get } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';

@Controller(`${adminConfig.adminPath}/account`)
export class AccountController {
  @Get()
  test1() {
    return '测试代码';
  }
}
