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
    private readonly accountRepository: Repository<AccountEntity> // @InjectRepository(LoginHistoryEntity) // private readonly loginHistoryRepository: Repository<LoginHistoryEntity>
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
