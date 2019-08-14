import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  UseInterceptors,
  Query,
  Request,
  ParseIntPipe,
  Param,
  Put,
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
import { ParseOptionalPipe } from './../../shared/pipe/parse.optional.pipe';
import { ParseIdAndUuidPipe } from './../../shared/pipe/parse.idanduuid.pipe';
import { UpdateUserDto } from './dto/update.user.dto';
import { TransformClassToPlain } from 'class-transformer';
import { ChangePasswordDto } from './dto/change.password.dto';
import { RegisterUserDto } from './dto/register.user.dto';

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
  @ApiOperation({ title: '用户注册', description: '输入用户名及密码' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: RegisterUserDto): Promise<UserRep> {
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
  @ApiOperation({
    title: '用户登录',
    description: '可以收入手机号码、邮箱、用户名',
  })
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
  @ApiOperation({ title: '查询全部用户', description: '支持分页查询' })
  @Get('user')
  @ApiBearerAuth()
  @UseInterceptors(PaginateInterceptor)
  @HttpCode(HttpStatus.OK)
  async showAll(
    @CurrentUser() user: any,
    @Query('pageSize', new ParseIntPipe()) pageSize: number,
    @Query('pageNumber', new ParseIntPipe()) pageNumber: number,
  ): Promise<UserRep[]> {
    Logger.log(user, '当前用户');
    return await this.userService.showAll(pageSize, pageNumber);
  }

  @ApiOperation({
    title: '根据用户id查询用户信息',
    description: '可传递id或者uuid',
  })
  @ApiBearerAuth()
  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('id', new ParseIdAndUuidPipe()) id: string,
  ): Promise<UserRep> {
    return await this.userService.findById(id);
  }

  @Put('user/:id')
  @ApiOperation({
    title: '根据用户id修改用户信息',
    description: '可传递id或者uuid',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async updateById(
    @Param('id', new ParseIdAndUuidPipe()) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserRep> {
    return await this.userService.updateById(data, id);
  }

  @ApiOperation({
    title: '根据用户id删除用户',
    description: '可传递id或者uuid',
  })
  @ApiBearerAuth()
  @Delete('user/:id')
  @HttpCode(HttpStatus.OK)
  async destroyById(
    @Param('id', new ParseIdAndUuidPipe()) id: string,
  ): Promise<string> {
    return this.userService.destroyById(id);
  }

  @ApiOperation({ title: '创建用户' })
  @ApiBearerAuth()
  @Post('user/add_user')
  @HttpCode(HttpStatus.CREATED)
  async addUser(@Body() data: CreateUserDto): Promise<UserRep> {
    return await this.userService.addUser(data);
  }

  @Post('user/change_password')
  @ApiOperation({ title: '修改密码' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') id: string,
    @Body() data: ChangePasswordDto,
  ): Promise<string> {
    return await this.userService.changePassword(id, data);
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
