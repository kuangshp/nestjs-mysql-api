import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@src/plugin/logger/logger.service';
import { ToolsService } from '@src/plugin/tools/tools.service';
import { Repository } from 'typeorm';
import { AccountEntity } from '../account/entities/account.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly toolsService: ToolsService,
    private readonly loggerService: LoggerService
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const { username, password } = loginDto;
    const accountEntity: Pick<AccountEntity, 'password' | 'id'> | null =
      await this.accountRepository.findOne({ where: { username }, select: ['password', 'id'] });
    console.log(accountEntity, '111111');
    if (accountEntity?.id && this.toolsService.checkPassword(password, accountEntity.password)) {
      return '登录成功';
    } else {
      this.loggerService.error('账号密码登录错误' + loginDto);
      throw new HttpException('账号密码不正确', HttpStatus.OK);
    }
  }
}
