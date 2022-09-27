import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum, StatusEnum } from '@src/enums';
import { QueryOptionsDto } from '@src/shared/dto/query.options.dto';
import { mapToObj } from '@src/utils';
import { Equal, FindOperator, ILike, Repository } from 'typeorm';
import { LoginHistoryEntity } from '../login/entities/login.history.entity';
import { CreateAccountDto } from './dto/account.dto';
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
   * @Date: 2022-09-27 08:27:26
   * @LastEditors:
   * @LastEditTime:
   * @Description: 创建账号
   * @param {CreateAccountDto} createAccountDto
   * @return {*}
   */
  async createAccount(createAccountDto: CreateAccountDto): Promise<string> {
    // 查询是否有相同的用户名
    const accountResult: Pick<AccountEntity, 'id'> | null = await this.accountRepository.findOne({
      where: [
        { username: createAccountDto.username },
        { mobile: createAccountDto.mobile },
        { email: createAccountDto.email },
      ],
      select: ['id'],
    });
    if (accountResult?.id) {
      throw new HttpException('用户名/手机号码/邮箱已经存在，不能重复创建', HttpStatus.OK);
    }
    const accountEntity = this.accountRepository.create(createAccountDto);
    await this.accountRepository.save(accountEntity);
    return '创建成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2022-09-27 08:35:32
   * @LastEditors:
   * @LastEditTime:
   * @Description: 根据id软删除账号数据
   * @param {number} accountId
   * @return {*}
   */
  async deleteAccountById(accountId: number): Promise<string> {
    // 不能删除超级管理员
    await this.checkIsSuper(accountId);
    const { affected } = await this.accountRepository.softDelete(accountId);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2022-09-27 08:58:45
   * @LastEditors:
   * @LastEditTime:
   * @Description: 根据id修改状态
   * @param {number} accountId
   * @return {*}
   */
  async modifyStatusById(accountId: number): Promise<string> {
    await this.checkIsSuper(accountId);
    const accountEntity: Pick<AccountEntity, 'status'> | null =
      await this.accountRepository.findOne({ where: { id: accountId }, select: ['status'] });
    const { affected } = await this.accountRepository.update(
      { id: accountId },
      {
        status:
          accountEntity?.status === StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN,
      }
    );
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }
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

  /**
   * @Author: 水痕
   * @Date: 2022-09-27 08:59:47
   * @LastEditors:
   * @LastEditTime:
   * @Description: 内部使用判断是否包括超级管理员
   * @param {number} accountId
   * @return {*}
   */
  private async checkIsSuper(accountId: number): Promise<void> {
    const accountEntity: Pick<AccountEntity, 'isSuper'> | null =
      await this.accountRepository.findOne({
        where: { id: accountId },
        select: ['isSuper'],
      });
    if (Object.is(accountEntity?.isSuper, 1)) {
      throw new HttpException('超级管理员不能直接删除', HttpStatus.OK);
    }
  }
}
