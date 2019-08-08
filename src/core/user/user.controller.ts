import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  Req,
  UseInterceptors,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { UserRep } from './dto/user.rep.dto';
import { CurlService } from '../curl/curl.service';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { PaginateInterceptor } from './../../shared/interceptor/paginate.interceptor';

@ApiUseTags('user')
// @ApiBearerAuth()
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly curlService: CurlService,
  ) {}

  /**
   * @Description: 用户注册
   * @Author: 水痕
   * @LastEditors: 水痕
   * @param {type}
   * @return:
   * @Date: 2019-07-30 16:21:47
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<UserRep> {
    return await this.userService.register(createUserDto);
  }

  /**
   * @Description: 用户登录
   * @Author: 水痕
   * @LastEditors: 水痕
   * @param {type}
   * @return:
   * @Date: 2019-07-30 16:21:34
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserRep> {
    return await this.userService.login(loginUserDto);
  }

  /**
   * @Description: 查询全部用户
   * @Author: 水痕
   * @LastEditors: 水痕
   * @param {type}
   * @return:
   * @Date: 2019-07-30 16:21:22
   */
  @Get('user')
  @UseInterceptors(PaginateInterceptor)
  async showAll(
    @Req() request: { [propName: string]: any },
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('pageNumber', new ParseIntPipe()) pageNumber: number,
  ): Promise<UserRep[]> {
    console.log('当前用户', request.user);
    return await this.userService.showAll(pageSize, pageNumber);
  }

  /**
   * @param {type}
   * @return:
   * @Description: 测试代码
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-02 13:47:42
   */
  @Get('test')
  async test(): Promise<any> {
    return await this.curlService.get('http://localhost:3000/api/v1/user/');
  }

  /**
   * @param {type}
   * @return:
   * @Description: 测试代码
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-02 13:48:06
   */
  @Post('test')
  async test1(): Promise<any> {
    return await this.curlService.post('http://localhost:3000/api/v1/user/', {
      name: '水痕',
      password: '12345',
      email: '22@qq.com',
      gender: 1,
    });
  }
}
