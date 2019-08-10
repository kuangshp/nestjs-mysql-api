import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/login.user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRep } from './dto/user.rep.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { isIntExp, isUuidExp } from './../../shared/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * @param {type}
   * @return:
   * @Description: 用户注册
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-09 17:51:47
   */
  async register(createUserDto: Partial<CreateUserDto>): Promise<UserRep> {
    const { name } = createUserDto;
    let user = await this.userRepository.findOne({ where: { name } });
    if (user) {
      throw new HttpException(
        { message: '用户名已经存在' },
        HttpStatus.BAD_REQUEST,
      );
    }
    user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user.toResponseObject(false);
  }

  /**
   * @param {type}
   * @return:
   * @Description: 用户登录
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-09 17:51:29
   */
  async login(loginUserDto: Partial<LoginUserDto>): Promise<UserRep> {
    const { name, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { name } });
    // 对用户输入的密码与数据库中的密码进行校验
    if (!user || !(await user.checkPassword(password, user.password))) {
      throw new HttpException('请检查你的用户名与密码', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }

  /**
   * @param {number} pageSize 一次查询多少条数据
   * @param {number} pageNumber 当前页面
   * @return: 查询全部的用户数据
   * @Description:
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-09 17:50:32
   */
  async showAll(pageSize: number, pageNumber: number): Promise<any> {
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .offset(pageNumber - 1) // 从多少条开始
      .limit(pageSize) // 查询多少条数据
      .orderBy('id', 'DESC') // 排序
      .getManyAndCount(); // 查询到数据及个数，返回的是一个数组
    // return [users.map(user => user.toResponseObject(false)), total];
    const user1 = await this.userRepository.query(
      'select * from user limit ?, ?',
      [pageNumber - 1, pageSize],
    );
    const count = await this.userRepository.query(
      'select count(*) count from user',
    );
    return [user1, count[0].count];
  }

  /**
   * @param {any} id
   * @return:
   * @Description: 根据id或者uuid查询用户具体信息
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-09 17:49:09
   */
  async findById(id: any): Promise<any> {
    let sql = 'select * from user where';
    if (isIntExp.test(id)) {
      sql += ' id = ?';
    } else {
      sql += ' uuid = ?';
    }
    const user = await this.userRepository.query(sql, id);
    delete user[0].password;
    return user[0];
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据用户id或者uui修改用户信息
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-10 09:46:43
   */
  async updateById(data: UpdateUserDto, id: any): Promise<any> {
    if (isIntExp.test(id)) {
      await this.userRepository.update(id, data);
      const user = await this.userRepository.findOne({ where: { id } });
      return user.toResponseObject(false);
    } else {
      // let updateQuery = '';
      // Object.keys(data).forEach(key => {
      //   updateQuery += `,${key}='${data[key]}'`;
      // });
      // const sql =
      //   'update user set ' + updateQuery.substring(1) + ' where uuid =?';
      // await this.userRepository.query(sql, [id]);
      // const user = await this.userRepository.findOne({ where: { uuid: id } });
      // return user.toResponseObject(false);
      const uuid = id;
      await this.userRepository.update(uuid, data);
      const user = await this.userRepository.findOne({ where: { uuid } });
      return user.toResponseObject(false);
    }
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据用户id删除用户
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-10 14:33:38
   */
  async destroyById(id: any): Promise<string> {
    let sql = 'delete from user where';
    if (isIntExp.test(id)) {
      sql += ' id=?';
    } else {
      sql += ' uuid=?';
    }
    await this.userRepository.query(sql, [id]);
    return '删除成功';
  }
}
