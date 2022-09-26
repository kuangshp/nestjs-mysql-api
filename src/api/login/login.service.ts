import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { LoggerService } from '@src/plugin/logger/logger.service';
import { ToolsService } from '@src/plugin/tools/tools.service';
import { isEmail, isMobilePhone } from 'class-validator';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import moment from 'moment';

import { AccountEntity } from '../account/entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';
import { RedisService } from '@src/plugin/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { IPAddress, IpToAddressService } from '@src/plugin/ip-to-address/ip-to-address.service';
import { AccountTokenEntity } from './entities/account.token.entity';
import { LoginHistoryEntity } from './entities/login.history.entity';

type findAccountType = Omit<AccountEntity, 'status' | 'created_at' | 'updated_at'>;
@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccountTokenEntity)
    private readonly accountTokenRepository: Repository<AccountTokenEntity>,
    private dataSource: DataSource,
    private readonly toolsService: ToolsService,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly ipToAddressService: IpToAddressService
  ) {}

  async login(loginDto: LoginDto, request: Request): Promise<LoginVo> {
    const ipAddress = this.toolsService.getReqIP(request);
    const { username, password } = loginDto;
    const queryBuilder = this.queryLoginBuilder;
    let accountEntity: findAccountType | null | undefined;
    let usernameRep = username;
    // 根据手机号码查询
    if (isMobilePhone(username, 'zh-CN')) {
      accountEntity = await queryBuilder
        .where('(account.mobile = :mobile)', { mobile: username })
        .getRawOne();
      usernameRep = '';
    } else if (isEmail(username)) {
      // 根据邮箱查询
      accountEntity = await queryBuilder
        .where('(account.email = :email)', { email: username })
        .getRawOne();
      usernameRep = '';
    } else {
      // 用户名查询
      accountEntity = await queryBuilder
        .where('(account.username = :username)', { username })
        .getRawOne();
    }
    if (accountEntity?.id && this.toolsService.checkPassword(password, accountEntity.password)) {
      // 生成token存储到token表中并且返回给前端
      const token = this.toolsService.uuidToken;
      try {
        await this.cacheTokenAndLoginInfo(accountEntity, token, ipAddress);
        return {
          token,
          id: accountEntity.id,
          username: usernameRep
            ? usernameRep
            : accountEntity.username.startsWith('_')
            ? ''
            : accountEntity.username,
          email: isEmail(accountEntity.email) ? accountEntity.email : '',
          mobile: isMobilePhone(accountEntity.mobile, 'zh-CN') ? accountEntity.mobile : '',
          isSuper: accountEntity.isSuper,
        };
      } catch (error: any) {
        throw new HttpException(error.message, HttpStatus.OK);
      }
    } else {
      this.loggerService.error(loginDto, '账号密码登录错误');
      throw new HttpException('账号密码不正确', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2022-09-26 21:28:36
   * @LastEditors:
   * @LastEditTime:
   * @Description: 内部拼装sql
   * @return {*}
   */
  private get queryLoginBuilder(): SelectQueryBuilder<findAccountType> {
    return this.accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.mobile', 'mobile')
      .addSelect('account.email', 'email')
      .addSelect('account.isSuper', 'isSuper')
      .addSelect('account.password', 'password');
  }

  /**
   * @Author: 水痕
   * @Date: 2022-09-26 21:33:52
   * @LastEditors:
   * @LastEditTime:
   * @Description: 将token存储到redis中和数据库中
   * @param {findAccountType} accountEntity
   * @param {string} token
   * @param {string} ipAddress
   * @return {*}
   */
  private async cacheTokenAndLoginInfo(
    accountEntity: findAccountType,
    token: string,
    ipAddress: string
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // 开启事物
    // 根据id查询到地址
    const ipAddressResult: IPAddress = await this.ipToAddressService.getAddress(ipAddress);
    try {
      await this.redisService.set(token, accountEntity);
      // 登录历史表中插入数据
      const loginHistoryEntity = queryRunner.manager.create<LoginHistoryEntity>(
        LoginHistoryEntity,
        {
          accountId: accountEntity.id,
          loginTime: new Date(),
          loginIp: ipAddress,
          nation: ipAddressResult.nation,
          province: ipAddressResult.province,
          city: ipAddressResult.city,
          district: ipAddressResult.district,
          adcode: ipAddressResult.adcode,
        }
      );
      await queryRunner.manager.save<LoginHistoryEntity>(loginHistoryEntity);
      // 更新账号token表
      const accountTokenEntity: Pick<AccountTokenEntity, 'token' | 'id'> | null =
        await this.accountTokenRepository.findOne({
          where: { accountId: accountEntity.id },
          select: ['token', 'id'],
        });
      const tokenExpire: number = this.configService.get('tokenExpire') ?? 1;
      if (accountTokenEntity) {
        // 存在就更新，否则就创建
        this.redisService.del(accountTokenEntity.token);
        await queryRunner.manager.update<AccountTokenEntity>(
          AccountTokenEntity,
          {
            id: accountTokenEntity.id,
          },
          {
            // 设置token失效时间
            expireTime: moment().add(tokenExpire, 'day').format('YYYY-MM-DD HH:mm:ss'),
            token,
          }
        );
      } else {
        const accountCreateResult: AccountTokenEntity =
          queryRunner.manager.create<AccountTokenEntity>(AccountTokenEntity, {
            accountId: accountEntity.id,
            token: token,
            expireTime: moment().add(tokenExpire, 'day').format('YYYY-MM-DD HH:mm:ss'),
          });
        await queryRunner.manager.save<AccountTokenEntity>(accountCreateResult);
      }
      await queryRunner.commitTransaction(); // 提交事务
    } catch (err) {
      await queryRunner.rollbackTransaction(); // 回滚操作
      this.loggerService.error('存储账号token到redis中失败', LoggerService.name);
      throw new HttpException('账号密码错误', HttpStatus.OK);
    } finally {
      // 最后你需要释放一个手动实例化的queryRunner
      await queryRunner.release();
    }
  }
}
