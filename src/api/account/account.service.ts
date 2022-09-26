import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum, StatusEnum } from '@src/enums';
import { mapToObj } from '@src/utils';
import { Equal, ILike, Repository } from 'typeorm';
import { QueryAccountDto } from './dto/account.query.dto';
import { AccountEntity } from './entities/account.entity';
import { AccountListVo } from './vo/account.vo';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>
  ) {}

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
    const queryMap = new Map<string, any>();
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
    const total: number = await this.accountRepository
      .createQueryBuilder('account')
      .where(mapToObj(queryMap))
      .getCount();
    // 1.查询账号表及关联查询到最后登录表信息
    const accountEntity: any = await this.accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.mobile', 'mobile')
      .addSelect('account.email', 'email')
      .addSelect('account.status', 'status')
      .addSelect('account.isSuper', 'isSuper')
      .addSelect('account.createdAt', 'createdAt')
      .addSelect('account.updatedAt', 'updatedAt')
      .where(mapToObj(queryMap))
      .getRawMany();
    return {
      data: accountEntity,
      total,
      pageNumber,
      pageSize,
    };
  }
}
