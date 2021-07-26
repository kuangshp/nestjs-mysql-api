import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { LoginDto } from '../../controllers/login/dto/login.dto';
import { AccountEntity } from '../../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, SelectQueryBuilder } from 'typeorm';
import { ToolsService } from '@src/modules/shared/services/tools/tools.service';
import { isMobilePhone, isEmail } from 'class-validator';
import { AccountLastLoginEntity } from '../../entities/account.last.login.entity';
import { LoginVo } from '../../controllers/login/vo/login.vo';
import { AccountTokenEntity } from '../../entities/account.token.entity';
import { ConfigService, InjectConfig } from 'nestjs-config';
import moment from 'moment';
import { usernameReg } from '@src/constants';
import { ICurrentUserType } from '@src/decorators/current.user';

@Injectable()
export class LoginService {
  private logger: Logger = new Logger(LoginService.name);
  constructor(
    @InjectRepository(AccountLastLoginEntity)
    private readonly accountLastLoginRepository: Repository<AccountLastLoginEntity>,
    @InjectRepository(AccountTokenEntity)
    private readonly accountTokenRepository: Repository<AccountTokenEntity>,
    private readonly toolsService: ToolsService,
    @InjectConfig()
    private readonly configService: ConfigService,
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
  async adminLogin(loginDto: LoginDto, ipAddress: string): Promise<LoginVo> {
    try {
      const { username, password } = loginDto;
      type TypeAccountFindResult = Extract<AccountEntity, ICurrentUserType> | undefined;
      let findAccount: TypeAccountFindResult;
      const queryBuilder = this.queryLoginBuilder;
      // 根据手机号码查询
      if (isMobilePhone(username, 'zh-CN')) {
        findAccount = await queryBuilder
          .where('(account.mobile = :mobile)', { mobile: username })
          .getRawOne();
      } else if (isEmail(username)) {
        // 根据邮箱查询
        findAccount = await queryBuilder
          .where('(account.email = :email)', { email: username })
          .getRawOne();
      } else {
        // 用户名查询
        findAccount = await queryBuilder
          .where('(account.username = :username)', { username })
          .getRawOne();
      }
      if (
        findAccount &&
        findAccount.password &&
        this.toolsService.checkPassword(password, findAccount.password)
      ) {
        // 记录最后登录时间和ip地址
        const lastLogin = this.accountLastLoginRepository.create({
          accountId: findAccount.id,
          lastLoginIp: ipAddress,
        });
        await this.accountLastLoginRepository.save(lastLogin);
        this.logger.log('当前用户', findAccount);
        // 生成token存储到token表中并且返回给前端
        const token = this.toolsService.uuidToken;
        const { id, username, email, mobile, isSuper, platform } =
          this.filterAccountField(findAccount);
        const tokenExpire: number = this.configService.get('admin.tokenExpire');
        const accountToken = {
          userId: id,
          username,
          email,
          mobile,
          isSuper,
          platform,
          token,
          // 设置token失效时间
          expireTime: moment().add(tokenExpire, 'day').format('YYYY-MM-DD HH:mm:ss'),
        };
        // 先判断之前是否有记录，有记录就更新，没记录就创建
        const accountTokenResult: Pick<AccountTokenEntity, 'id'> | undefined =
          await this.accountTokenRepository.findOne({
            where: { userId: id },
            select: ['id'],
          });
        if (accountTokenResult?.id) {
          await this.accountTokenRepository.update({ id: accountTokenResult.id }, accountToken);
        } else {
          const accountTokenSave: AccountTokenEntity =
            this.accountTokenRepository.create(accountToken);
          await this.accountTokenRepository.save(accountTokenSave);
        }
        return {
          token,
          id,
          username,
          email,
          mobile,
          isSuper,
          platform,
        };
      } else {
        throw new HttpException('用户名或密码错误', HttpStatus.OK);
      }
    } catch (e) {
      this.logger.error('用户名或密码错误', e);
      throw new HttpException('用户名或密码错误', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-07-26 09:07:15
   * @LastEditors: 水痕
   * @Description: 公共的查询部分
   * @param {*}
   * @return {*}
   */
  private get queryLoginBuilder(): SelectQueryBuilder<AccountEntity> {
    return getConnection()
      .createQueryBuilder(AccountEntity, 'account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.mobile', 'mobile')
      .addSelect('account.email', 'email')
      .addSelect('account.platform', 'platform')
      .addSelect('account.isSuper', 'isSuper')
      .addSelect('account.password', 'password');
  }

  /**
   * @Author: 水痕
   * @Date: 2021-07-26 10:15:17
   * @LastEditors: 水痕
   * @Description: 过来字段
   * @param {ICurrentUserType} accountInfo
   * @return {*}
   */
  private filterAccountField(accountInfo: ICurrentUserType): ICurrentUserType {
    const { username, mobile, email } = accountInfo;
    const _mobile = isMobilePhone(mobile, 'zh-CN') ? mobile : '';
    const _email = isEmail(email) ? email : '';
    const _username = usernameReg.test(username) ? username : '';
    return {
      ...accountInfo,
      username: _username,
      mobile: _mobile,
      email: _email,
    };
  }
}
