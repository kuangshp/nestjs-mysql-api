import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '@src/api/account/entities/account.entity';
import { TenantEntity } from '@src/api/tenant/entities/tenant.entity';
import { Repository } from 'typeorm';
import moment from 'moment';
import { ToolsService } from '@src/plugin/tools/tools.service';
import { AccountTypeEnum } from '@src/enums/account.type.enum';
@Injectable()
export class InitDbService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    private readonly configService: ConfigService,
    private readonly toolsService: ToolsService
  ) {}

  onModuleInit() {
    console.log('初始化数据库');
    this.initData();
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 20:30:24
   * @LastEditors: 水痕
   * @Description: 初始化账号
   * @return {*}
   */
  private async initData(): Promise<void> {
    // 1.初始化商户
    const total = await this.tenantRepository.count();
    if (total == 0) {
      const tenantData = this.tenantRepository.create({
        name: '总集团',
        username: '张三',
        mobile: '1111',
        expireTime: moment()
          .add(99 * 355, 'day')
          .format('YYYY-MM-DD HH:mm:ss'),
        description: '总集团',
      });
      await this.tenantRepository.save(tenantData);
      // 初始化账号
      const username: string = this.configService.get('defaultAccount') ?? 'admin';
      const defaultPassword: string = this.configService.get('defaultPassword') ?? '123456';
      const salt = this.toolsService.getRandomSalt;
      const password = this.toolsService.makePassword(defaultPassword, salt);
      const accountData = this.accountRepository.create({
        username,
        password,
        salt,
        tenantId: tenantData.id,
        accountType: AccountTypeEnum.SUPER_ACCOUNT,
      });
      await this.accountRepository.save(accountData);
    }
  }
}
