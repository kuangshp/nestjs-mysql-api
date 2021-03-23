import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from '../../controllers/login/dto/login.dto';
import { AccountEntity } from '../../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { ToolsService } from '@src/modules/shared/services/tools/tools.service';
import { isMobilePhone, isEmail } from 'class-validator';
import { AccountLastLoginEntity } from '../../entities/account.last.login.entity';
import { LoginResDto } from '../../controllers/login/dto/login.res.dto';

@Injectable()
export class LoginService {
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
  async adminLogin(loginDto: LoginDto, ipAddress: string): Promise<LoginResDto> {
    try {
      const { username, password } = loginDto;
      let sqlPassword: string = '';
      let findAccount: AccountEntity | undefined;
      if (isMobilePhone(username, 'zh-CN')) {
        const findResult:AccountEntity | undefined = await getConnection().createQueryBuilder(AccountEntity, 'account')
          .select([])
          .addSelect('account.password', 'password')
          .where('(account.mobile = :mobile)', {mobile: username})
          .getRawOne();
        sqlPassword = findResult!.password;
        findAccount = await this.accountRepository.findOne({where: {mobile: username}});
      } else if (isEmail(username)) {
        const findResult: AccountEntity | undefined = await getConnection().createQueryBuilder(AccountEntity, 'account')
          .select([])
          .addSelect('account.password', 'password')
          .where('(account.email = :email)', { email: username })
          .getRawOne();
        sqlPassword = findResult!.password;
        findAccount = await this.accountRepository.findOne({ where: { email: username } });
      } else {
        const findResult: AccountEntity | undefined = await getConnection().createQueryBuilder(AccountEntity, 'account')
          .select([])
          .addSelect('account.password', 'password')
          .where('(account.username = :username)', { username })
          .getRawOne();
        sqlPassword = findResult!.password;
        findAccount = await this.accountRepository.findOne({ where: {  username } });
      }
      if (sqlPassword && this.toolsService.checkPassword(password, sqlPassword)) {
        const lastLogin = this.accountLastLoginRepository.create({ accountId: findAccount!.id, lastLoginIp:ipAddress});
        await this.accountLastLoginRepository.save(lastLogin);
        return findAccount!.toResponseObject(true);
      } else {
        throw new HttpException('用户名或密码错误', HttpStatus.OK);
      }
    } catch(e) {
      throw new HttpException('用户名或密码错误', HttpStatus.OK);
    }
  }
}
