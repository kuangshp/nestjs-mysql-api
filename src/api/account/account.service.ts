import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountEntity } from './entities/account.entity';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOperator, ILike, In, Repository, SelectQueryBuilder } from 'typeorm';
import { AccountDto } from './dto/account.dto';
import { ICurrentUserType } from '@src/decorators';
import { ToolsService } from '@src/plugin/tools/tools.service';
import { ConfigService } from '@nestjs/config';
import { AccountPageVo, AccountVo } from './vo/account.vo';
import { QueryAccountDto } from './dto/account.query';
import { AccountTypeEnum } from '@src/enums/account.type.enum';
import { PageEnum, StatusEnum } from '@src/enums';
import { mapToObj } from '@src/utils';
import { TenantEntity } from '../tenant/entities/tenant.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly toolsService: ToolsService,
    private readonly configService: ConfigService
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:18:20
   * @LastEditors: 水痕
   * @Description: 创建账号
   * @return {*}
   */
  async createAccountApi(
    req: AccountDto,
    request: Request,
    currentInfo: ICurrentUserType
  ): Promise<string> {
    // 1.判断当前商户下是否已经存在该账号
    const accountEntity: Pick<AccountEntity, 'id'> | null = await this.accountRepository.findOne({
      where: { username: req.username, tenantId: currentInfo.tenantId },
      select: ['id'],
    });
    if (accountEntity?.id) {
      throw new HttpException(`[${req.username}]可能已经存在,请先检查`, HttpStatus.OK);
    }
    // 默认密码加密
    const salt = this.toolsService.getRandomSalt;
    const defaultPassword: string = this.configService.get('defaultPassword') ?? '123456';
    const password = this.toolsService.makePassword(defaultPassword, salt);
    // 创建数据
    const data = this.accountRepository.create({
      username: req.username,
      sort: req.sort,
      password: password,
      tenantId: currentInfo.tenantId,
      parentId: currentInfo.accountId,
      salt: salt,
      lastLoginIp: this.toolsService.getReqIP(request),
      lastLoginDate: new Date(),
    });
    await this.accountRepository.save(data);
    return '创建成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:18:35
   * @LastEditors: 水痕
   * @Description: 根据id删除账号
   * @param {number} id
   * @return {*}
   */
  async deleteAccountByIdApi(id: number, currentUser: ICurrentUserType): Promise<string> {
    const { accountId } = currentUser;
    // TODO 判断不能删除自己及下面有账号的
    if (Object.is(id, accountId)) {
      throw new HttpException('自己不能删除自己', HttpStatus.OK);
    }
    const accountEntity: Pick<AccountEntity, 'id'> | null = await this.accountRepository.findOne({
      where: { parentId: id },
      select: ['id'],
    });
    if (accountEntity?.id) {
      throw new HttpException('下面有子账号不能直接删除', HttpStatus.OK);
    }
    // 超管不能被删除
    const accountEntity1: Pick<AccountEntity, 'accountType'> | null =
      await this.accountRepository.findOne({ where: { id }, select: ['accountType'] });
    if (accountEntity1 && accountEntity1.accountType == AccountTypeEnum.SUPER_ACCOUNT) {
      throw new HttpException('超管不能被删除', HttpStatus.OK);
    }
    const { affected } = await this.accountRepository.softDelete(id);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 20:56:57
   * @LastEditors: 水痕
   * @Description: 根据id修改状态
   * @param {number} id
   * @return {*}
   */
  async modifyAccountStatusByIdApi(id: number): Promise<string> {
    const accountEntity: Pick<AccountEntity, 'status'> | null =
      await this.accountRepository.findOne({
        where: { id },
        select: ['status'],
      });
    if (!accountEntity) {
      throw new HttpException('传递的id错误', HttpStatus.OK);
    }
    const { affected } = await this.accountRepository.update(id, {
      status:
        accountEntity?.status == StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN,
    });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:19:29
   * @LastEditors: 水痕
   * @Description: 根据id修改账号数据
   * @param {number} id
   * @param {AccountDto} req
   * @return {*}
   */
  async modifyAccountByIdApi(id: number, req: AccountDto): Promise<string> {
    const { affected } = await this.accountRepository.update(id, req);
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 19:37:13
   * @LastEditors: 水痕
   * @Description: 分页获取账号
   * @return {*}
   */
  async getAccountPageApi(
    queryOption: QueryAccountDto,
    currentInfo: ICurrentUserType
  ): Promise<AccountPageVo> {
    const {
      status,
      username,
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
    } = queryOption;
    const query = new Map<string, FindOperator<string>>();
    if (username) {
      query.set('username', ILike(`%${username}%`));
    }
    if ([StatusEnum.NORMAL, StatusEnum.FORBIDDEN].includes(status)) {
      query.set('status', Equal(status + ''));
    }
    const { accountType, accountId, tenantId } = currentInfo;
    /**
     * 1.如果是超管,查询到全部的账号
     * 2.如果不是超管,是主账号的时候查询下面全部的账号
     * 3.如果都不是,只能查询账号下的数据
     */
    if (accountType == AccountTypeEnum.SUPER_ACCOUNT) {
      console.log('超管不需要');
    } else if (accountType == AccountTypeEnum.PRIMARY_ACCOUNT) {
      query.set('tenantId', Equal(tenantId + ''));
    } else if (accountType == AccountTypeEnum.NORMAL_ACCOUNT) {
      query.set('parentId', Equal(accountId + ''));
    }
    const total = await this.accountRepository
      .createQueryBuilder('account')
      .where(mapToObj(query))
      .getCount();
    const queryBuilder = this.queryAccountBuilder;
    const data = await queryBuilder
      .where(mapToObj(query))
      .orderBy({ id: 'DESC' })
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .printSql()
      .getRawMany();
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 20:28:16
   * @LastEditors: 水痕
   * @Description: 根据id获取单条数据
   * @param {number} id
   * @return {*}
   */
  async getAccountByIdApi(id: number): Promise<AccountVo | undefined> {
    return await this.queryAccountBuilder.where('account.id = :id', { id }).getRawOne();
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-10 15:42:14
   * @LastEditors: 水痕
   * @Description: 批量删除
   * @return {*}
   */
  async batchDeleteAccountByIdListApi(
    idList: number[],
    currentUser: ICurrentUserType
  ): Promise<string> {
    const { accountId } = currentUser;
    // TODO 判断不能删除自己及下面有账号的
    if (idList.includes(accountId)) {
      throw new HttpException('自己不能删除自己', HttpStatus.OK);
    }
    const accountEntityList: Pick<AccountEntity, 'id'>[] = await this.accountRepository.find({
      where: { parentId: In(idList) },
      select: ['id'],
    });
    if (accountEntityList.length) {
      throw new HttpException('下面有子账号不能直接删除', HttpStatus.OK);
    }
    // 超管不能被删除
    const accountEntityList1: Pick<AccountEntity, 'accountType'>[] =
      await this.accountRepository.find({ where: { id: In(idList) }, select: ['accountType'] });
    if (
      accountEntityList1.length &&
      accountEntityList1
        .map((item) => item.accountType)
        .some((item) => item == AccountTypeEnum.SUPER_ACCOUNT)
    ) {
      throw new HttpException('超管不能被删除', HttpStatus.OK);
    }
    const { affected } = await this.accountRepository.softDelete(idList);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-10 15:43:23
   * @LastEditors: 水痕
   * @Description: 批量修改状态
   * @return {*}
   */
  async batchModifyAccountStatusByIdApi(
    idList: number[],
    currentUser: ICurrentUserType
  ): Promise<string> {
    const { accountId } = currentUser;
    if (idList.includes(accountId)) {
      throw new HttpException('自己不能修改自己', HttpStatus.OK);
    }
    const accountEntityList: Pick<AccountEntity, 'status'>[] = await this.accountRepository.find({
      where: { id: In(idList) },
      select: ['status'],
    });
    const statusList = accountEntityList.map((item) => item.status);
    if ([...new Set(statusList)].length > 1) {
      throw new HttpException('当前传递的数据状态不统一,不能批量操作', HttpStatus.OK);
    }
    const { affected } = await this.accountRepository.update(idList, {
      status: statusList[0] == StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN,
    });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-07 20:28:53
   * @LastEditors: 水痕
   * @Description: 内部使用
   * @return {*}
   */
  get queryAccountBuilder(): SelectQueryBuilder<AccountEntity> {
    return this.accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.accountType', 'accountType')
      .addSelect('account.tenantId', 'tenantId')
      .addSelect('account.parentId', 'parentId')
      .addSelect('account.sort', 'sort')
      .addSelect('account.status', 'status')
      .addSelect('account.lastLoginIp', 'lastLoginIp')
      .addSelect('account.lastLoginNation', 'lastLoginNation')
      .addSelect('account.lastLoginProvince', 'lastLoginProvince')
      .addSelect('account.lastLoginCity', 'lastLoginCity')
      .addSelect('account.lastLoginDistrict', 'lastLoginDistrict')
      .addSelect('account.lastLoginAdcode', 'lastLoginAdcode')
      .addSelect('account.lastLoginDate', 'lastLoginDate')
      .addSelect('account.createdAt', 'createdAt')
      .addSelect('account.updatedAt', 'updatedAt')
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('account1.id', 'parentId')
            .addSelect('account1.username', 'parentName')
            .from(AccountEntity, 'account1'),
        'account1',
        'account.parentId=account1.id'
      )
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('tenant.id', 'tenantId')
            .addSelect('tenant.name', 'tenantName')
            .from(TenantEntity, 'tenant'),
        'tenant',
        'account.tenantId=tenant.id'
      );
  }
}
