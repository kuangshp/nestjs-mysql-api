import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '../../entities/account.entity';
import { Repository, getConnection } from 'typeorm';
import { CreateAccountDto } from '../../controllers/account/dto/create.account.dto';
import adminConfig from '@src/config/admin.config';
import { usernameReg } from '@src/constants';
import { isMobilePhone, isEmail } from 'class-validator';

@Injectable()
export class AccountService {
  constructor (
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 08:36:42
   * @LastEditors: 水痕
   * @Description: 创建账号
   * @param {CreateAccountDto} createAccountDto
   * @return {*}
   */
  async createAccount(createAccountDto: CreateAccountDto): Promise<string> {
    const {username, email, mobile} = createAccountDto;
    const queryConditionList = [];
    if (username) {
      queryConditionList.push('account.username = :username');
    }
    if (email) {
      queryConditionList.push('account.email = :email');
    }
    if (mobile) {
      queryConditionList.push('account.mobile = :mobile');
    }
    const queryCondition = queryConditionList.join(' OR ');
    const findAccount = await getConnection().createQueryBuilder(AccountEntity, 'account')
      .select(['account.username', 'account.email', 'account.mobile'])
      .andWhere(queryCondition, { username, email, mobile})
      .getOne();
    if (findAccount) {
      const {username, email, mobile} = findAccount;
      if (usernameReg.test(username)) {
        return '创建失败,已经存在该用户名';
      } else if(isMobilePhone(mobile, 'zh-CN')) {
        return '创建失败,已经存在该手机号码';
      } else if (isEmail(email)){
        return '创建失败,已经存在该邮箱号';
      } else {
        return '创建失败';
      }
    } else {
      const account = this.accountRepository.create({ ...createAccountDto, password: adminConfig.defaultPassword });
      await this.accountRepository.save(account);
      return '创建成功';
    }
    
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 09:01:05
   * @LastEditors: 水痕
   * @Description: 根据id删除账号
   * @param {number} id
   * @return {*}
   */
  async destroyById(id: number):Promise<string> {
    const { raw: { affectedRows}} = await this.accountRepository.delete(id);
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }
}
