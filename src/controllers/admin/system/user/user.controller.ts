import { Controller, Post, HttpCode, HttpStatus, Body, Get, Param, Delete, Patch, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import adminConfig from '@src/config/admin.config';

import { UserService } from '@src/service/admin/user/user.service';

import { CreateUserDto } from './dto/create.user.dto';
import { UserRep } from './dto/user.rep.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UpdatePasswordDto } from './dto/update.password.dto';
import { ParseIdAndUuidPipe } from '@src/pipe/parse.idanduuid.pipe';
import { CurrentUser } from '@src/decorators/current.user';
import { UserRoleService } from '@src/service/admin/user-role/user-role.service';
import { AssiginRoleDto } from './dto/assign_role.dto';
import { RoleRep } from '../role/dto/role.rep.dto';

@ApiTags('用户模块')
@ApiBearerAuth()
@Controller(`${adminConfig.adminPath}/user`)
export class UserController {
  constructor (
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:37:41
   * @LastEditors: 水痕
   * @Description: 获取全部的用户
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '用户列表', description: '获取用户列表' })
  @ApiOkResponse({ type: [UserRep] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async userList(@Query() querOption: { [propsName: string]: any }): Promise<UserRep[]> {
    return await this.userService.findPage(querOption);;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 09:37:48
   * @LastEditors: 水痕
   * @Description: 注册用户
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '创建用户', description: '输入用户名及密码' })
  @ApiCreatedResponse({
    type: CreateUserDto,
    description: '创建用户DTO'
  })
  @ApiOkResponse({ type: UserRep })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserRep> {
    const user = await this.userService.create(createUserDto);
    return user.toResponseObject(false);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 12:45:25
   * @LastEditors: 水痕
   * @Description: 根据id查询用户
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '获取用户信息', description: '根据id或uuid查询用户信息' })
  @ApiOkResponse({ type: UserRep })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<UserRep> {
    const user = await this.userService.findById(id);
    return user.toResponseObject(false);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-24 19:53:47
   * @LastEditors: 水痕
   * @Description: 根据条件查询是否数据
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '查询用户信息', description: '查询用户信息' })
  @ApiOkResponse({ type: UserRep })
  @Post('search')
  @HttpCode(HttpStatus.OK)
  async search(@Body() data: UpdateUserDto): Promise<UserRep> {
    return this.userService.findOne(data);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 13:20:23
   * @LastEditors: 水痕
   * @Description: 根据id或者uuid删除数据
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '删除用户信息', description: '根据id或uuid删除用户信息' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@CurrentUser('id') currentUserId: string, @Param('id', new ParseIdAndUuidPipe()) id: string): Promise<string> {
    const { affected } = await this.userService.deleteUserById(currentUserId, id);
    if (affected) {
      return `成功删除${id}数据`;
    } else {
      return `删除${id}失败`;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 15:10:31
   * @LastEditors: 水痕
   * @Description: 修改用户密码
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '修改用户自己密码', description: '传递新老密码修改密码' })
  @ApiOkResponse({ type: UserRep })
  @Patch('modify_password')
  @HttpCode(HttpStatus.OK)
  async modifyPassword(@CurrentUser('id') id: string | number, @Body() data: UpdatePasswordDto): Promise<UserRep> {
    const user = await this.userService.modifyPassword(id, data);
    return user.toResponseObject(false);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 15:24:44
   * @LastEditors: 水痕
   * @Description: 重置密码为默认密码
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '重置用户密码', description: '传递用户id就可以,默认密码是123456' })
  @ApiOkResponse({ type: UserRep })
  @Patch('reset_password/:id')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Param('id', new ParseIdAndUuidPipe()) id: string): Promise<UserRep> {
    const user = await this.userService.resetPassword(id);
    return user.toResponseObject(false);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 15:09:29
   * @LastEditors: 水痕
   * @Description: 根据用户id或uuid修改用户数据
   * @param {type} 
   * @return: 
   */
  @ApiOperation({ summary: '修改用户信息', description: '根据id或uuid修改用户信息' })
  @ApiOkResponse({ type: UserRep })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id', new ParseIdAndUuidPipe()) id: string, @Body() data: UpdateUserDto): Promise<UserRep> {
    const user = await this.userService.updateById(id, data);
    return user.toResponseObject(false);
  }

  /**
    * @Author: 水痕
    * @Date: 2020-02-05 12:11:09
    * @LastEditors: 水痕
    * @Description: 获取用户当前的角色及可分配的角色
    * @param {type} 
    * @return: 
    */
  @ApiOperation({ summary: '获取可分配角色(获取角色树)', description: '根据当前的用户id获取角色' })
  @ApiOkResponse({ type: [RoleRep] })
  @Get('role_tree/:userId')
  @HttpCode(HttpStatus.OK)
  async roleTree(
    @Param('userId', new ParseIntPipe()) userId: number
  ): Promise<RoleRep[]> {
    return this.userRoleService.roleTree(userId);
  }

  /**
    * @Author: 水痕
    * @Date: 2020-02-05 12:10:53
    * @LastEditors: 水痕
    * @Description: 给用户分配角色
    * @param {type}
    * @return:
    */
  @ApiOperation({ summary: '给用户分配角色', description: '传递userId和roleList数组' })
  @Post('assigin_role')
  @HttpCode(HttpStatus.OK)
  async assignRole(@Body() body: AssiginRoleDto): Promise<any> {
    return await this.userRoleService.assignRole(body);
  }
}
