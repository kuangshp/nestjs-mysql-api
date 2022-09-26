import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { LoginVo } from './vo/login.vo';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @Post()
  async login(@Body() loginDto: LoginDto, @Req() request: Request): Promise<LoginVo> {
    return await this.loginService.login(loginDto, request);
  }
}
