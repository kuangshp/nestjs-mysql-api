import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../system/user/dto/create.user.dto';
import { UserRep } from '../system/user/dto/user.rep.dto';
import { ToolsService } from '@src/service/tools/tools.service';
import { UserService } from '@src/service/admin/user/user.service';
import { UserLoginDto } from '../system/user/dto/user.login.dto';

@ApiTags('用户登录')
@Controller('login')
export class LoginController {
  constructor (private readonly userService: UserService) { }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 11:05:36
   * @LastEditors: 水痕
   * @Description: 用户登录
   * @param {type} 
   * @return: 
   */
  @ApiOperation({
    summary: '用户登录',
    description: '用户名可以是手机号码、邮箱、用户名',
  })
  @ApiCreatedResponse({
    type: UserLoginDto,
    description: '用户登录DTO'
  })
  @ApiOkResponse({ type: UserRep })
  @Post()
  async login(@Body() userLoginDto: UserLoginDto): Promise<UserRep> {
    return this.userService.login(userLoginDto);
  }
}
