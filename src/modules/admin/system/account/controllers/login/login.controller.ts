import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import adminConfig from '@src/config/admin.config';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';

import { LoginService } from '../../services/login/login.service';
import { LoginDto } from './dto/login.dto';
import { IpAddress } from '@src/decorators/ip.address';
import { LoginResDto } from './dto/login.res.dto';

@ApiTags('后台管理系统-用户登录')
@Controller(`${adminConfig.adminPath}/login`)
export class LoginController {
  constructor(
    private readonly loginService:LoginService,
  ) {}

  @ApiOperation({
    summary: '用户登录',
    description: '用户名可以是手机号码、邮箱、用户名',
  })
  @ApiCreatedResponse({
    type: LoginResDto,
    description: '用户登录返回值'
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async adminLogin(
    @Body() loginDto: LoginDto,
    @IpAddress() ipAddress: string,
  ): Promise<LoginResDto> {
    return this.loginService.adminLogin(loginDto, ipAddress);
  }
}
