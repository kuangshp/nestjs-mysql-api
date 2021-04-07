import { Injectable } from '@nestjs/common';
import { AccountEntity } from '@src/modules/admin/system/account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessEntity } from '@src/modules/admin/system/access/entities/access.entity';
import adminConfig from '@src/config/admin.config';
import { ObjectType } from '@src/types/obj-type';

@Injectable()
export class InitDbService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) {}

  onModuleInit() {
    console.log('初始化数据库');
    this.initAccount();
    this.initAccess();
  }

  /**
   * @Author: 水痕
   * @Date: 2021-04-05 21:56:38
   * @LastEditors: 水痕
   * @Description: 初始化账号
   * @param {*}
   * @return {*}
   */
  private async initAccount(): Promise<void> {
    const username = adminConfig.defaultAccount;
    const password = adminConfig.defaultPassword;
    const isExist = await this.accountRepository.findOne({ where: { username } });
    if (!isExist) {
      const account = this.accountRepository.create({ username, password, isSuper: 1 });
      await this.accountRepository.save(account);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-04-05 21:56:56
   * @LastEditors: 水痕
   * @Description: 初始化资源
   * @param {*}
   * @return {*}
   */
  private async initAccess(): Promise<void> {
    const accessList: ObjectType[] = [
      {
        moduleName: '系统管理',
        parentId: 0,
        url: 'system',
        type: 1,
        sort: 6,
      },
      {
        actionName: '账号管理',
        url: 'system/account',
        parentId: '1',
        type: 2,
        sort: 3,
      },
      {
        actionName: '角色管理',
        url: 'system/role',
        parentId: '1',
        type: 2,
        sort: 4,
      },
      {
        actionName: '资源管理',
        url: 'system/access',
        parentId: '1',
        type: 2,
        sort: 5,
      },
      {
        url: '/api/v1/admin/account',
        parentId: '2',
        type: 3,
        sort: 1,
        apiName: '账号列表',
        method: 'GET',
      },
      {
        url: '/api/v1/admin/account',
        parentId: '2',
        type: 3,
        sort: 2,
        apiName: '创建账号',
        method: 'POST',
      },
      {
        url: '/api/v1/admin/account/*',
        parentId: '2',
        type: 3,
        sort: 3,
        apiName: '根据ID删除账号',
        method: 'DELETE',
      },
      {
        url: '/api/v1/admin/account/*',
        parentId: '2',
        type: 3,
        sort: 4,
        apiName: '根据ID修改账号',
        method: 'PATCH',
      },
    ];
    // 如果不存在的时候就插入数据
    const isExist = await this.accessRepository.count();
    if (!isExist) {
      // 批量插入数据
      await this.accessRepository.insert(accessList);
    }
  }
}
