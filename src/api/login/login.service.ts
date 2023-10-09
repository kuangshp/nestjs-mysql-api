import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@src/plugin/logger/logger.service';
import { RedisService } from '@src/plugin/redis/redis.service';
import { ToolsService } from '@src/plugin/tools/tools.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { LoginAccountVo, LoginTokenDataVo, LoginVo } from './vo/login.vo';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly toolsService: ToolsService,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService
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
    const accountEntity: LoginAccountVo | undefined = await this.queryLoginBuilder
      .where('(account.username = :username)', { username: username })
      .getRawOne();
    if (accountEntity?.id) {
      console.log(accountEntity.password, '111', password);
      // 判断密码是否正确
      const saltPassword = this.toolsService.makePassword(password, accountEntity.salt);
      if (Object.is(saltPassword, accountEntity.password)) {
        return await this.generateToken(accountEntity);
      } else {
        throw new HttpException('账号或密码错误', HttpStatus.OK);
      }
    } else {
      this.loggerService.error('传递的用户名错误');
      throw new HttpException('账号或密码错误', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:44:55
   * @LastEditors: 水痕
   * @Description:
   * @param {string} token
   * @return {*}
   */
  async refreshTokenApi(token: string): Promise<LoginVo> {
    // 1.在redis中读取是否有这个token
    const redisData = await this.redisService.get(token);
    if (redisData) {
      const redisDataObj = redisData as unknown as LoginTokenDataVo;
      return await this.generateToken(redisDataObj.userInfo);
    } else {
      throw new HttpException(
        JSON.stringify({ code: 10025, message: '你还没登录,请先登录' }),
        HttpStatus.OK
      );
    }
  }

  /**
   * @Author:
   * @Date: 2023-10-08 07:52:37
   * @LastEditors:
   * @Description: 内部使用查询数据
   * @return {*}
   */
  private get queryLoginBuilder(): SelectQueryBuilder<LoginAccountVo> {
    return this.accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.tenantId', 'tenantId')
      .addSelect('account.status', 'status')
      .addSelect('account.accountType', 'accountType')
      .addSelect('account.password', 'password')
      .addSelect('account.salt', 'salt');
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 09:07:02
   * @LastEditors: 水痕
   * @Description: 内部生成token
   * @param {LoginAccountVo} accountEntity
   * @return {*}
   */
  private async generateToken(
    accountEntity: LoginAccountVo
  ): Promise<Promise<Promise<Promise<LoginVo>>>> {
    // 生成token存储到token表中并且返回给前端
    const tokenExpire: number = this.configService.get('tokenExpire') ?? 2;
    const refreshTokenExpire: number = this.configService.get('refreshTokenExpire') ?? 7;
    const token = this.toolsService.uuidToken;
    const refreshToken = this.toolsService.uuidToken;
    const sign = this.toolsService.uuidToken;
    // 根据资源id获取资源信息
    const redisData: LoginTokenDataVo = {
      userInfo: accountEntity, // 用户信息
      sign,
    };
    // 正常token
    await this.redisService.set(token, redisData, tokenExpire * 60 * 60);
    // 刷新token
    await this.redisService.set(refreshToken, redisData, refreshTokenExpire * 24 * 60 * 60);
    // 删除redis中历史的token,并且设置新的
    const accountTokenKey = this.toolsService.generateLoginTokenKey(accountEntity.id);
    const accountRefreshTokenKey = this.toolsService.generateLoginRefreshTokenKey(accountEntity.id);
    const accountToken = (await this.redisService.get(accountTokenKey)) as unknown as string;
    const accountRefreshToken = (await this.redisService.get(
      accountRefreshTokenKey
    )) as unknown as string;
    console.log(accountToken, accountRefreshToken, '要删除的');
    await this.redisService.del(accountToken);
    await this.redisService.del(accountRefreshToken);
    this.redisService.set(accountTokenKey, token, tokenExpire * 60 * 60);
    this.redisService.set(accountRefreshTokenKey, refreshToken, refreshTokenExpire * 24 * 60 * 60);
    return {
      id: accountEntity.id, // 账号id
      username: accountEntity.username, // 用户名
      accountType: accountEntity.accountType, // 账号类型:0普通账号,1是主账号,2是超管
      token, // 登录的token
      refreshToken,
      sign,
    };
  }
}
