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
  Request,
  ParseIntPipe,
  Param,
  Put,
  ParseUUIDPipe,
  Logger,
  Delete,
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { UserRep } from './dto/user.rep.dto';
import { CurlService } from '../curl/curl.service';
import { PaginateInterceptor } from './../../shared/interceptor/paginate.interceptor';
import { CurrentUser } from './../../shared/decorators/current.user';
import { ParseOptionalPipe } from 'src/shared/pipe/parse.optional.pipe';
import { ParseIdAndUuidPipe } from './../../shared/pipe/parse.idanduuid.pipe';
import { UpdateUserDto } from './dto/update.user.dto';

@ApiUseTags('user')
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
  @ApiBearerAuth()
  @UseInterceptors(PaginateInterceptor)
  async showAll(
    @CurrentUser() user: any,
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('pageNumber', new ParseIntPipe()) pageNumber: number,
  ): Promise<UserRep[]> {
    Logger.log(user, '当前用户');
    return await this.userService.showAll(pageSize, pageNumber);
  }

  @Get('user/:id')
  @ApiOperation({
    title: '根据用户id查询用户信息',
    description: '可传递id或者uuid',
  })
  @ApiBearerAuth()
  async findById(
    @Param('id', new ParseIdAndUuidPipe()) id: string | number,
  ): Promise<UserRep> {
    return await this.userService.findById(id);
  }

  @Put('user/:id')
  @ApiOperation({
    title: '根据用户id修改用户信息',
    description: '可传递id或者uuid',
  })
  @ApiBearerAuth()
  async updateById(
    @Param('id', new ParseIdAndUuidPipe()) id: string | number,
    @Body() data: UpdateUserDto,
  ): Promise<UserRep> {
    return await this.userService.updateById(data, id);
  }

  @Delete('user/:id')
  @ApiOperation({
    title: '根据用户id删除用户',
    description: '可传递id或者uuid',
  })
  @ApiBearerAuth()
  async destroyById(
    @Param('id', new ParseIdAndUuidPipe()) id: string | number,
  ): Promise<string> {
    return this.userService.destroyById(id);
  }

  @Post('user/add_user')
  @ApiOperation({ title: '创建用户' })
  @ApiBearerAuth()
  async addUser(@Body() data: CreateUserDto): Promise<UserRep> {
    return await this.userService.addUser(data);
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
