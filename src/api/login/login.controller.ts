import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { LoginVo } from './vo/login.vo';

@Controller()
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  async loginApi(@Body() req: LoginDto): Promise<LoginVo> {
    return await this.loginService.loginApi(req);
  }

  @Get('refresh')
  async refreshTokenApi(@Query('token') token: string): Promise<LoginVo> {
    return await this.loginService.refreshTokenApi(token);
  }
}
