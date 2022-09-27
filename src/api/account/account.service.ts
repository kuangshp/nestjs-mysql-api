import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum, StatusEnum } from '@src/enums';
import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';
import { mapToObj } from '@src/utils';
import { Equal, FindOperator, ILike, Repository } from 'typeorm';
import { LoginHistoryEntity } from '../login/entities/login.history.entity';
import { QueryAccountDto } from './dto/account.query.dto';
import { AccountEntity } from './entities/account.entity';
import { AccountListVo, LoginHistoryListVo } from './vo/account.vo';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(LoginHistoryEntity)
    private readonly loginHistoryRepository: Repository<LoginHistoryEntity>
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2022-09-27 08:16:35
   * @LastEditors:
   * @LastEditTime:
   * @Description: 根据账号id分页查询登录历史
   * @param {number} accountId
   * @param {QueryOptionsDto} queryOptions
   * @return {*}
   */
  async getLoginHistoryByAccountId(
    accountId: number,
    queryOptions: QueryOptionsDto
  ): Promise<LoginHistoryListVo> {
    const { pageNumber = PageEnum.PAGE_NUMBER, pageSize = PageEnum.PAGE_SIZE } = queryOptions;
    const [data, total] = await this.loginHistoryRepository
      .createQueryBuilder('loginHistory')
      .where('loginHistory.accountId = :accountId')
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .setParameters({ accountId })
      .orderBy({ id: 'DESC' })
      .printSql()
      .getManyAndCount();
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }
  /**
   * @Author: 水痕
   * @Date: 2022-09-26 22:02:40
   * @LastEditors:
   * @LastEditTime:
   * @Description: 分页获取账号列表数据
   * @param {QueryAccountDto} queryOptions
   * @return {*}
   */
  async getAccountPage(queryOptions: QueryAccountDto): Promise<AccountListVo> {
    const {
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      username,
      status,
      mobile,
      email,
    } = queryOptions;
    const queryMap = new Map<string, FindOperator<string>>();
    if (username) {
      queryMap.set('username', ILike(`%${username}%`));
    }
    if (mobile) {
      queryMap.set('mobile', Equal(mobile));
    }
    if (email) {
      queryMap.set('email', Equal(email));
    }
    if ([StatusEnum.NORMAL, StatusEnum.FORBIDDEN].includes(+status)) {
      queryMap.set('status', Equal(status));
    }
    const [data, total] = await this.accountRepository
      .createQueryBuilder()
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy({ id: 'DESC' })
      .printSql()
      .where(mapToObj(queryMap))
      .getManyAndCount();
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }
}
