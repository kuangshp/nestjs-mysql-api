import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { LoginUserDto } from './dto/login.user.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRep } from './dto/user.rep.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(createUserDto: Partial<CreateUserDto>): Promise<UserRep> {
    const { name } = createUserDto;
    let user = await this.userRepository.findOne({ where: { name } });
    if (user) {
      throw new HttpException(
        { message: '用户名已经存在' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // await this.userRepository.save(createUserDto);
    // return user.toResponseObject(false);
    user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user.toResponseObject(false);
  }

  async login(loginUserDto: Partial<LoginUserDto>): Promise<UserRep> {
    const { name, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { name } });
    // 对用户输入的密码与数据库中的密码进行校验
    if (!user || !(await user.checkPassword(password, user.password))) {
      throw new HttpException('请检查你的用户名与密码', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject();
  }

  async showAll(pageSize: number, pageNumber: number): Promise<any> {
    // const users = await this.userRepository.find();
    // return users.map(user => user.toResponseObject(false));
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
}
