import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { LoginDto } from '../../controllers/login/dto/login.dto';
import { AccountEntity } from '../../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { ToolsService } from '@src/modules/shared/services/tools/tools.service';
import { isMobilePhone, isEmail } from 'class-validator';
import { AccountLastLoginEntity } from '../../entities/account.last.login.entity';
import { LoginVo } from '../../controllers/login/vo/login.vo';

@Injectable()
export class LoginService {
  private logger: Logger = new Logger(LoginService.name);
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccountLastLoginEntity)
    private readonly accountLastLoginRepository: Repository<AccountLastLoginEntity>,
    private readonly toolsService: ToolsService,
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
      let sqlPassword: string | undefined;
      let findAccount: AccountEntity | undefined;
      if (isMobilePhone(username, 'zh-CN')) {
        const findResult: Pick<AccountEntity, 'password'> | undefined = await getConnection()
          .createQueryBuilder(AccountEntity, 'account')
          .select([])
          .addSelect('account.password', 'password')
          .where('(account.mobile = :mobile)', { mobile: username })
          .getRawOne();
        sqlPassword = findResult?.password;
        findAccount = await this.accountRepository.findOne({ where: { mobile: username } });
      } else if (isEmail(username)) {
        const findResult: Pick<AccountEntity, 'password'> | undefined = await getConnection()
          .createQueryBuilder(AccountEntity, 'account')
          .select([])
          .addSelect('account.password', 'password')
          .where('(account.email = :email)', { email: username })
          .getRawOne();
        sqlPassword = findResult?.password;
        findAccount = await this.accountRepository.findOne({ where: { email: username } });
      } else {
        const findResult: Pick<AccountEntity, 'password'> | undefined = await getConnection()
          .createQueryBuilder(AccountEntity, 'account')
          .select([])
          .addSelect('account.password', 'password')
          .where('(account.username = :username)', { username })
          .getRawOne();
        sqlPassword = findResult?.password;
        findAccount = await this.accountRepository.findOne({ where: { username } });
      }
      if (sqlPassword && this.toolsService.checkPassword(password, sqlPassword) && findAccount) {
        const lastLogin = this.accountLastLoginRepository.create({
          accountId: findAccount.id,
          lastLoginIp: ipAddress,
        });
        await this.accountLastLoginRepository.save(lastLogin);
        this.logger.log('当前用户', findAccount);
        return Object.assign(findAccount, { token: this.toolsService.generateToken(findAccount) });
      } else {
        throw new HttpException('用户名或密码错误', HttpStatus.OK);
      }
    } catch (e) {
      this.logger.error('用户名或密码错误', e);
      throw new HttpException('用户名或密码错误', HttpStatus.OK);
    }
  }
}
