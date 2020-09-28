import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from '@src/entities/model/system/account.entity';
import { Repository } from 'typeorm';
import adminConfig from '@src/config/admin.config';
import { AccessEntity } from '@src/entities/model/system/access.entity';
import { ObjectType } from '@src/types';

@Injectable()
export class InitDbService implements OnModuleInit {
  constructor (
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) { }

  onModuleInit() {
    console.log('初始化数据库');
    this.initAccount();
    this.initAccess();
  }

  /**
   * @Author: 水痕
   * @Date: 2020-09-18 17:37:57
   * @LastEditors: 水痕
   * @Description: 初始化超级管理员
   * @param {type} 
   * @return {type} 
   */
  private async initAccount(): Promise<void> {
    const username = adminConfig.defaultAccount;
    const password = adminConfig.defaultPassword;
    const isExist = await this.accountRepository.findOne({ where: { username } });
    if (!isExist) {
      const account = await this.accountRepository.create({ username, password, isSuper: 1 });
      await this.accountRepository.save(account);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-09-19 11:31:11
   * @LastEditors: 水痕
   * @Description: 初始化基本菜单
   * @param {type} 
   * @return {type} 
   */
  private async initAccess(): Promise<void> {
    const accessList: ObjectType[] = [
      {
        moduleName: '系统管理',
        url: 'system',
        actionName: null,
        moduleId: -1,
        sort: 6,
      },
      {
        actionName: '账号管理',
        url: 'system/account',
        moduleId: '1',
        sort: '3',
      },
      {
        actionName: '角色管理',
        url: 'system/role',
        moduleId: '1',
        sort: '4',
      },
      {
        actionName: '资源管理',
        url: 'system/access',
        moduleId: '1',
        sort: '5',
      },
      {
        actionName: '字典管理',
        url: 'system/dict',
        moduleId: '1',
        sort: '6',
      },
    ];
    // 如果不存在的时候就插入数据
    const isExist = await this.accessRepository.count();
    if (!isExist) {
      for (const item of accessList) {
        const account = await this.accessRepository.create(item);
        await this.accessRepository.save(account);
      }
    }
  }
}
