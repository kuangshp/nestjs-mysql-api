import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from '../../controllers/login/dto/login.dto';
import { AccountEntity } from '../../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { ToolsService } from '@src/modules/shared/services/tools/tools.service';
import { isMobilePhone, isEmail } from 'class-validator';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
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
  async adminLogin(loginDto: LoginDto, ipAddress:string):Promise<any> {
    try {
      console.log(this.accountRepository, loginDto, ipAddress, this.toolsService)
      const { username, password } = loginDto;
      let sqlPassword: string = '';
      let findAccount: AccountEntity | undefined;
      if (isMobilePhone(username, 'zh-CN')) {
        const findResult = await getConnection().createQueryBuilder(AccountEntity, 'account')
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
        return findAccount?.toResponseObject(true);
      } else {
        throw new HttpException('用户名或密码错误', HttpStatus.OK);
      }
    } catch(e) {
      throw new HttpException('用户名或密码错误', HttpStatus.OK);
    }
  }
}
