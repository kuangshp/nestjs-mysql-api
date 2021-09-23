import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { LoginService } from '../../services/login/login.service';
import { LoginDto } from './dto/login.dto';
import { IpAddress } from '@src/decorators/ip.address';
import { LoginVo } from './vo/login.vo';
import { LoggerService } from '@src/modules/shared/services/logger/logger.service';

@ApiTags('后台管理系统-用户登录')
@Controller('login')
export class LoginController {
  private readonly logger: Logger = new Logger(LoginController.name);
  private readonly loggerService = new LoggerService(LoginController.name);
  constructor(private readonly loginService: LoginService) {}

  @ApiOperation({
    summary: '用户登录',
    description: '用户名可以是手机号码、邮箱、用户名',
  })
  @ApiOkResponse({
    type: LoginVo,
    description: '用户登录返回值',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async adminLogin(@Body() loginDto: LoginDto, @IpAddress() ipAddress: string): Promise<LoginVo> {
    this.logger.log('接收的登录参数:', loginDto);
    this.loggerService.info(loginDto, '登录的参数');
    return this.loginService.adminLogin(loginDto, ipAddress);
  }
}
