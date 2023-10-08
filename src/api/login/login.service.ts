import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@src/plugin/logger/logger.service';
import { RedisService } from '@src/plugin/redis/redis.service';
import { ToolsService } from '@src/plugin/tools/tools.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';

type findAccountType = Omit<AccountEntity, 'created_at' | 'updated_at'>;

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly toolsService: ToolsService,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 07:51:37
   * @LastEditors: 水痕
   * @Description: 登录操作
   * @param {LoginDto} req
   * @return {*}
   */
  async loginApi(req: LoginDto): Promise<LoginVo> {
    const { username, password } = req;
    const accountEntity:
      | Pick<AccountEntity, 'id' | 'username' | 'status' | 'accountType' | 'password' | 'salt'>
      | undefined = await this.queryLoginBuilder
      .where('(account.username = :username)', { username: username })
      .getRawOne();
    if (accountEntity?.id) {
      console.log(accountEntity.password, '111', password);
      // 判断密码是否正确
      const saltPassword = this.toolsService.makePassword(password, accountEntity.salt);
      if (Object.is(saltPassword, accountEntity.password)) {
        // 生成token存储到token表中并且返回给前端
        const token = this.toolsService.uuidToken;
        // 根据资源id获取资源信息
        this.redisService.set(
          token,
          {
            userInfo: accountEntity, // 用户信息
          },
          7 * 24 * 60 * 60
        );
        return {
          id: accountEntity.id, // 账号id
          username: accountEntity.username, // 用户名
          accountType: accountEntity.accountType, // 账号类型:0普通账号,1是主账号,2是超管
          token, // 登录的token
        };
      } else {
        throw new HttpException('账号或密码错误', HttpStatus.OK);
      }
    } else {
      this.loggerService.error('传递的用户名错误');
      throw new HttpException('账号或密码错误', HttpStatus.OK);
    }
  }

  /**
   * @Author:
   * @Date: 2023-10-08 07:52:37
   * @LastEditors:
   * @Description: 内部使用查询数据
   * @return {*}
   */

  private get queryLoginBuilder(): SelectQueryBuilder<findAccountType> {
    return this.accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.status', 'status')
      .addSelect('account.accountType', 'accountType')
      .addSelect('account.password', 'password')
      .addSelect('account.salt', 'salt');
  }
}
