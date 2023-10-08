import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';
import { LoginVo } from './vo/login.vo';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  async loginApi(@Body() req: LoginDto): Promise<LoginVo> {
    return await this.loginService.loginApi(req);
  }
}
