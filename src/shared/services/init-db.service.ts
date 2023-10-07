import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '@src/api/account/entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InitDbService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly configService: ConfigService
  ) {}

  onModuleInit() {
    console.log('初始化数据库');
    this.initAccount();
  }

  /**
   * @Author: 水痕
   * @Date: 2022-09-26 20:34:13
   * @LastEditors:
   * @LastEditTime:
   * @Description: 初始化账号
   * @return {*}
   */
  private async initAccount(): Promise<void> {
    const username: string = this.configService.get('defaultAccount') ?? 'admin';
    const password: string = this.configService.get('defaultPassword') ?? '123456';
    const accountEntity: Pick<AccountEntity, 'id'> | null = await this.accountRepository.findOne({
      where: { username },
      select: ['id'],
    });
    if (!accountEntity?.id) {
      const account = this.accountRepository.create({ username, password, isSuper: 1 });
      await this.accountRepository.save(account);
    }
  }
}
