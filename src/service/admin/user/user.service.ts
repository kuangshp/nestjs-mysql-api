import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from '@src/service/base/base.service';
import { UserLoginDto } from '@src/controllers/admin/system/user/dto/user.login.dto';
import { UserRep } from '@src/controllers/admin/system/user/dto/user.rep.dto';
import { ToolsService } from '@src/service/tools/tools.service';
import { UpdatePasswordDto } from '@src/controllers/admin/system/user/dto/update.password.dto';
import { ConfigService, InjectConfig } from 'nestjs-config';
import { sqlParamsJoin, sqlWhere, channelObject } from '@src/utils';
import { CreateUserDto } from '@src/controllers/admin/system/user/dto/create.user.dto';

@Injectable()
export class UserService extends BaseService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly toolsService: ToolsService,
    @InjectConfig() private readonly configService: ConfigService,
  ) {
    super(userRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-26 20:41:29
   * @LastEditors: 水痕
   * @Description: 创建用户
   * @param {type} 
   * @return: 
   */
  public async create(createUserDto: CreateUserDto): Promise<any> {
    // 判断用户名、手机号码、邮箱是否存在
    const { username, mobile, email } = createUserDto;
    if (username) {
      const result = await this.userRepository.count({ username });
      if (result) {
        throw new HttpException(`你创建的username:${username},数据库已经存在,不能重复创建`, HttpStatus.OK);
      }
    }
    if (mobile) {
      const result = await this.userRepository.count({ mobile });
      if (result) {
        throw new HttpException(`你创建的mobile:${mobile},数据库已经存在,不能重复创建`, HttpStatus.OK);
      }
    }
    if (email) {
      const result = await this.userRepository.count({ email });
      if (result) {
        throw new HttpException(`你创建的email:${email},数据库已经存在,不能重复创建`, HttpStatus.OK);
      }
    }
    const user = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }
  /**
   * @Author: 水痕
   * @Date: 2020-01-23 11:24:14
   * @LastEditors: 水痕
   * @Description: 用户登录
   * @param {type} 
   * @return: 
   */
  async login(userLoginDto: UserLoginDto): Promise<UserRep> {
    const { username, password } = userLoginDto;
    let user: any;
    if (this.validator.isMobilePhone(username, 'zh-CN')) {
      user = await this.userRepository.findOne({ where: { mobile: username } });
    } else if (this.validator.isEmail(username)) {
      user = await this.userRepository.findOne({ where: { email: username } });
    } else {
      user = await this.userRepository.findOne({ where: { username } });
    }
    if (user && this.toolsService.checkPassword(password, user.password)) {
      return user.toResponseObject();
    } else {
      throw new HttpException('请检查你的用户名与密码', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 14:34:57
   * @LastEditors: 水痕
   * @Description: 用户自己修改自己的密码
   * @param {type} 
   * @return: 
   */
  async modifyPassword(id: string | number, data: UpdatePasswordDto): Promise<any> {
    const user = await this.userRepository.findOne({ id: Number(id) });
    const { password, oldPassword, checkPassword } = data;
    if (!Object.is(password, checkPassword)) {
      throw new HttpException('两次密码不一致', HttpStatus.OK);
    }
    if (user && this.toolsService.checkPassword(oldPassword, user.password)) {
      const { raw: { changedRows } } = await this.userRepository.update({ id: user.id }, { password: this.toolsService.makePassword(password) });
      if (changedRows) {
        return await this.userRepository.findOne({ id: Number(id) });
      } else {
        throw new HttpException('修改密码失败', HttpStatus.OK);
      }
    } else {
      throw new HttpException('修改密码失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 15:19:07
   * @LastEditors: 水痕
   * @Description: 重置用户密码为默认密码
   * @param {type} 
   * @return: 
   */
  async resetPassword(id: string): Promise<any> {
    let user: any;
    if (this.validator.isUUID(id)) {
      user = await this.userRepository.findOne({ uuid: id })
    } else if (this.validator.isInt(Number(id))) {
      user = await this.userRepository.findOne({ id: Number(id) })
    }
    if (user) {
      const definedPassword = this.configService.get('admin.defaultPassword')
      const password = this.toolsService.makePassword(definedPassword);
      const { raw: { changedRows } } = await this.userRepository.update({ id: user.id }, { password });
      if (changedRows) {
        return await this.userRepository.findOne({ id: Number(id) });
      } else {
        throw new HttpException('修改密码失败', HttpStatus.OK);
      }
    } else {
      throw new HttpException('重置密码失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-25 10:51:27
   * @LastEditors: 水痕
   * @Description: 删除用户
   * @param {type} 
   * @return: 
   */
  async deleteUserById(currentId: string, id: string): Promise<any> {
    const deleteUser = await this.findById(id);
    if (deleteUser && deleteUser.id == currentId) {
      throw new HttpException('自己不能删除自己', HttpStatus.OK);
    }
    return this.deleteById(id);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-25 16:12:32
   * @LastEditors: 水痕
   * @Description: 更新数据
   * @param {type} 
   * @return: 
   */
  public async updateById(id: string, data: any): Promise<any> {
    const result: any = await this.findById(id);
    const { username, mobile, email } = data;
    // 判断修改的不能重名
    const searchUsernameResult = await this.userRepository.query(`select id from user where username='${username}'`);
    if (searchUsernameResult && searchUsernameResult.length && !Object.is(result.id, searchUsernameResult[0].id)) {
      throw new HttpException(`你修改的username:${username},数据库已经存在,不能重名`, HttpStatus.OK);
    }
    const searchMobileResult = await this.userRepository.query(`select id from user where mobile='${mobile}'`);
    if (searchMobileResult && searchMobileResult.length && !Object.is(result.id, searchMobileResult[0].id)) {
      throw new HttpException(`你修改的mobile:${mobile},数据库已经存在,不能重名`, HttpStatus.OK);
    }
    const searchEmailResult = await this.userRepository.query(`select id from user where email='${email}'`);
    if (searchEmailResult && searchEmailResult.length && !Object.is(result.id, searchEmailResult[0].id)) {
      throw new HttpException(`你修改的email:${email},数据库已经存在,不能重名`, HttpStatus.OK);
    }

    if (result) {
      const sql = `update user set ${sqlParamsJoin(data)} where id=${result.id}`;
      const { affectedRows } = await this.userRepository.query(sql);
      if (affectedRows) {
        return await this.findById(id);
      } else {
        throw new HttpException(`传递的id:${id},修改数据失败`, HttpStatus.OK);
      }
    } else {
      throw new HttpException(`传递的id:${id},查无该条数据`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-25 16:59:45
   * @LastEditors: 水痕
   * @Description: 分页查询数据
   * @param {type} 
   * @return: 
   */
  public async findPage(options?: { [propsName: string]: any }): Promise<any> {
    let { pageSize, pageNumber, username, mobile, email, status } = channelObject(options);
    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;
    if (!this.validator.isInt(Number(pageSize)) || !this.validator.isInt(Number(pageNumber))) {
      throw new HttpException(`传递的pageSize:${pageSize},pageNumber:${pageNumber}其中一个不是整数`, HttpStatus.OK);
    } else {
      const sql1: string = 'select user.* from user ';
      const sql2: string = sqlWhere({ mobile, email, status }, 'user');
      let sql3: string = '';
      if (username) {
        sql3 = (sql2 && sql2.trim()) ? ` and user.username like '%${username}%' ` : ` where user.username like '%${username}%' `;
      }
      const sql4: string = ` order by created_at desc limit ${(pageNumber - 1) * pageSize}, ${pageNumber * pageSize};`;
      const sql5: string = sql1 + sql2 + sql3 + sql4;
      let data = await this.userRepository.query(sql5);
      const total = await this.userRepository.query('select count(*) as total from user' + sql2 + sql3);
      return {
        data: data.map((item: any) => {
          const { password, ...others } = item;
          return others;
        }),
        total: total[0].total,
        pageNumber,
        pageSize,
      };
    }
  }
}
