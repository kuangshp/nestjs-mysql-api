import { Injectable } from '@nestjs/common';
import { LoginDto } from '../../controllers/login/dto/login.dto';
import { AccountEntity } from '../../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2021-03-22 11:57:32
   * @LastEditors: 水痕
   * @Description: 后台管理用户登录
   * @param {LoginDto} loginDto
   * @param {string} ipAddress
   * @return {*}
   */
  async adminLogin(loginDto: LoginDto, ipAddress:string):Promise<string> {
    console.log(this.accountRepository, loginDto, ipAddress)
    return '登录成功';
  }
}
