import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@src/plugin/logger/logger.service';
import { ToolsService } from '@src/plugin/tools/tools.service';
import { isEmail, isMobilePhone } from 'class-validator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly toolsService: ToolsService,
    private readonly loggerService: LoggerService
  ) {}

  async login(loginDto: LoginDto): Promise<LoginVo> {
    const { username, password } = loginDto;
    const queryBuilder = this.queryLoginBuilder;
    let accountEntity:
      | Omit<AccountEntity, 'status' | 'created_at' | 'updated_at'>
      | null
      | undefined;
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
    } else {
      this.loggerService.error(loginDto, '账号密码登录错误');
      throw new HttpException('账号密码不正确', HttpStatus.OK);
    }
  }

  private get queryLoginBuilder(): SelectQueryBuilder<
    Omit<AccountEntity, 'status' | 'created_at' | 'updated_at'>
  > {
    return this.accountRepository
      .createQueryBuilder('account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.mobile', 'mobile')
      .addSelect('account.email', 'email')
      .addSelect('account.isSuper', 'isSuper')
      .addSelect('account.password', 'password');
  }
}
