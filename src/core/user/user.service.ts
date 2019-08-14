import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import { NodeAuth } from 'node-auth0';
import { Validator } from 'class-validator';

import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/login.user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRep } from './dto/user.rep.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { isIntExp, sqlParamsJoin } from './../../shared/utils';
import { UserExtendEntity } from './user.extend.entity';
import { ChangePasswordDto } from './dto/change.password.dto';
import { RegisterUserDto } from './dto/register.user.dto';

@Injectable()
export class UserService {
  private nodeAuth: NodeAuth;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    this.nodeAuth = new NodeAuth(8, 10, true);
  }

  /**
   * @param {type}
   * @return:
   * @Description: 用户注册
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-09 17:51:47
   */
  async register(createUserDto: Partial<RegisterUserDto>): Promise<UserRep> {
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
    const validator: Validator = new Validator();
    let user: UserEntity;
    if (validator.isMobilePhone(name, 'zh-CN')) {
      user = await this.userRepository.findOne({ where: { mobile: name } });
    } else if (validator.isEmail(name)) {
      user = await this.userRepository.findOne({ where: { email: name } });
    } else {
      user = await this.userRepository.findOne({ where: { name } });
    }
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
    // 使用orm查询
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .offset(pageNumber - 1) // 从多少条开始
      .limit(pageSize) // 查询多少条数据
      .orderBy('id', 'DESC') // 排序
      .getManyAndCount(); // 查询到数据及个数，返回的是一个数组
    // return [users.map(user => user.toResponseObject(false)), total];
    /**
     * 关联表的查询
     * select u.id, u.uuid, u.name, u.mobile, u.email, u.create_at, u.update_at,
     * ue.address, ue.avatar, ue.birthday, ue.company, ue.position from user as u
     * left join user_extend as ue on u.id=ue.user_id
     * ORDER BY id DESC limit 0, 10;
     */
    const user1 = await this.userRepository.query(
      'select u.id, u.uuid, u.name, u.mobile, u.email, u.create_at, u.update_at from user as u  order by update_at desc limit ?, ?',
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
    try {
      const user = await this.userRepository.query(sql, id);
      delete user[0].password;
      return user[0];
    } catch (e) {
      throw new HttpException(`你输入的:${id}不存在`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据用户id或者uui修改用户信息及用户扩展表
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-10 09:46:43
   */
  async updateById(data: UpdateUserDto, id: any): Promise<any> {
    const {
      email,
      mobile,
      gender,
      isActive,
      company,
      position,
      address,
      avatar,
    } = data;
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        if (isIntExp.test(id)) {
          const sql1 =
            'update user set ' +
            sqlParamsJoin({
              email,
              mobile,
              gender,
              isActive,
            }) +
            ' where id=?';
          await entityManager.query(sql1, [id]);
          const sql2 =
            'update user_extend set ' +
            sqlParamsJoin({ company, position, address, avatar }) +
            ' where user_id=?';
          await entityManager.query(sql2, [id]);
          // await entityManager.update<UserEntity>(
          //   UserEntity,
          //   { id },
          //   {
          //     email,
          //     mobile,
          //     gender,
          //     isActive,
          //   },
          // );
          // const userExtend = await this.userExtendRepository.findOne({
          //   where: { userId: id },
          // });
          // // update只能根据主键更新
          // await entityManager.update<UserExtendEntity>(
          //   UserExtendEntity,
          //   { id: userExtend.id },
          //   {
          //     company,
          //     position,
          //     address,
          //     avatar,
          //   },
          // );
        } else {
          const sql1 =
            'update user set ' +
            sqlParamsJoin({
              email,
              mobile,
              gender,
              isActive,
            }) +
            ' where uuid=?';
          const sql2 =
            'update user_extend set ' +
            sqlParamsJoin({
              company,
              position,
              address,
              avatar,
            }) +
            ' where user_id=?';
          await entityManager.query(sql1, [id]);
          const user = await entityManager.query(
            'select id from user where uuid=?',
            [id],
          ); // 获取到用户id
          await entityManager.query(sql2, [user[0].id]);
          // await entityManager.update<UserEntity>(
          //   UserEntity,
          //   { uuid: id },
          //   {
          //     email,
          //     mobile,
          //     gender,
          //     isActive,
          //   },
          // );
          // const user = await entityManager.query(
          //   'select id from user where uuid=?',
          //   [id],
          // ); // 获取到用户id
          // await entityManager.update<UserExtendEntity>(
          //   UserExtendEntity,
          //   { user_id: user[0].id },
          //   {
          //     company,
          //     position,
          //     address,
          //     avatar,
          //   },
          // );
        }
      })
      .then(async () => {
        let sql =
          // tslint:disable-next-line:max-line-length
          'select u.id,u.uuid,u.name,u.mobile,u.email,u.is_active,u.gender,u.create_at,u.update_at, ue.birthday,ue.company,ue.position,ue.address,ue.avatar from user as u inner join user_extend as ue on u.id=ue.user_id where';
        if (isIntExp.test(id)) {
          sql += ' u.id=?';
        } else {
          sql += ' u.uuid=?';
        }
        return await getManager().query(sql, [id]);
      })
      .catch(() => {
        return '修改数据失败';
      });
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据用户id删除用户及用户扩展表
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-10 14:33:38
   */
  async destroyById(id: any): Promise<any> {
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        let userSql = 'delete from user where';
        let userQuerySql = 'select id from user where';
        if (isIntExp.test(id)) {
          userSql += ' id=?';
          userQuerySql += ' id=?';
        } else {
          userSql += ' uuid=?';
          userQuerySql += ' uuid=?';
        }
        const user = await entityManager.query(userQuerySql, [id]); // 查找当前要删除的数据
        await entityManager.query(userSql, [id]); // 删除用户表
        await entityManager.query('delete from user_extend where user_id=?', [
          user[0].id,
        ]); // 删除用户扩展表
      })
      .then(() => {
        return '删除成功';
      })
      .catch(() => {
        return '删除失败';
      });
  }

  /**
   * @param {type}
   * @return:
   * @Description: 后台中添加用户
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-10 16:45:35
   */
  async addUser(data: CreateUserDto): Promise<any> {
    const {
      name,
      password,
      mobile,
      email,
      gender,
      isActive,
      company,
      position,
      birthday,
      address,
    } = data;
    return getManager()
      .transaction(async (entityManage: EntityManager) => {
        const findName = await this.userRepository.findOne({ where: { name } });
        const findMobile = await this.userRepository.findOne({
          where: { mobile },
        });
        const findEmail = await this.userRepository.findOne({
          where: { email },
        });
        if (findName) {
          throw new HttpException(
            { message: `${name}已经存在,不能重复创建` },
            HttpStatus.BAD_REQUEST,
          );
        }
        if (findMobile) {
          throw new HttpException(
            { message: `${mobile}已经存在,不能重复创建` },
            HttpStatus.BAD_REQUEST,
          );
        }
        if (findEmail) {
          throw new HttpException(
            { message: `${email}已经存在,不能重复创建` },
            HttpStatus.BAD_REQUEST,
          );
        }
        const user: { [propsName: string]: any } = await entityManage.save(
          UserEntity,
          {
            name,
            password: this.nodeAuth.makePassword(password),
            mobile,
            email,
            gender,
            isActive,
          },
        );
        await entityManage.save(UserExtendEntity, {
          userId: user.id,
          company,
          position,
          birthday,
          address,
        });
      })
      .then(async () => {
        const user = await getManager().query(
          // tslint:disable-next-line:max-line-length
          'select user.*,e.company, e.birthday, e.position, e.address, e.avatar from user INNER JOIN user_extend e on user.id = e.user_id WHERE user.name = ?',
          [name],
        );
        delete user[0].password;
        return user;
      })
      .catch(e => {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      });
  }

  /**
   * @param {type}
   * @return:
   * @Description: 根据当前用户id修改密码
   * @Author: 水痕
   * @LastEditors: 水痕
   * @Date: 2019-08-11 16:20:32
   */
  async changePassword(id: string, data: ChangePasswordDto): Promise<string> {
    const { password, newPassword, repPassword } = data;
    if (!Object.is(newPassword, repPassword)) {
      throw new HttpException('两次密码不一致', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.findOne({ where: { id } });
    // 当前用户存在且旧密码校验正确才可以修改
    if (user && this.nodeAuth.checkPassword(password, user.password)) {
      await this.userRepository.update(id, {
        password: this.nodeAuth.makePassword(newPassword),
      });
      return '修改成功';
    } else {
      throw new HttpException('修改失败', HttpStatus.BAD_REQUEST);
    }
  }
}
