import { Controller, Post } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';
import { LoginService } from '../../services/login/login.service';

@Controller(`${adminConfig.adminPath}/login`)
export class LoginController {
  constructor(
    private readonly loginService:LoginService,
  ) {}

  @Post()
  async login():Promise<string> {
    return await this.loginService.login();
  }
}
