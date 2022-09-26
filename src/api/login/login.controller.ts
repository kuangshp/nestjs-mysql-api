import { Controller, Post } from '@nestjs/common';

@Controller('login')
export class LoginController {
  @Post()
  async login(): Promise<string> {
    return '登录';
  }
}
