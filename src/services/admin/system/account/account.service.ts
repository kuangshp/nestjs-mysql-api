/* eslint-disable prefer-const */
import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection, getManager, EntityManager } from 'typeorm';
import { ToolsService } from '@src/services/tools/tools.service';
import { ObjectType } from '@src/types';
import { UpdatePasswordDto } from '@src/controllers/admin/system/account/dto/update.password.dto';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { channelObject, fileObjectField } from '@src/utils';
import { RoleAccessEntity } from '@src/entities/model/system/role_access.entity';
import { AccessEntity } from '@src/entities/model/system/access.entity';
import { DictConfigEntry } from '@src/entities/model/system/dict.config.entity';
import { AccountEntity } from '@src/entities/model/system/account.entity';
import { CreateAccountDto } from '@src/controllers/admin/system/account/dto/create.account.dto';
import { UpdateAccountDto } from '@src/controllers/admin/system/account/dto/update.account.dto';
import { AccountRoleEntity } from '@src/entities/model/system/account_role.entity';
import { RoleEntity } from '@src/entities/model/system/role.entity';

@Injectable()
export class AccountService {
  constructor (
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectConfig()
    private readonly configService: ConfigService,
    private readonly toolsService: ToolsService,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 14:15:47
   * @LastEditors: 水痕
   * @Description: 添加用户
   * @param {type} 
   * @return: 
   */
  async createAccount(createAccountDto: CreateAccountDto): Promise<string> {
    try {
      let { username, roles, password, ...oths } = createAccountDto;
      // 处理用户名、邮箱、手机号码只能唯一
      if (await this.findOne('username', username)) {
        throw new HttpException(`${username}已经存在,不能重复添加`, HttpStatus.OK);
      }
      return getManager()
        .transaction(async (entityManage: EntityManager) => {
          const newPassword = this.toolsService.makePassword(password);
          const account: ObjectType = await entityManage.save(AccountEntity, { username, password: newPassword, ...fileObjectField(oths) });
          // 如果角色有就添加角色
          if (roles) {
            const rolesList = roles.split(',');
            for (const item of rolesList) {
              await entityManage.save(AccountRoleEntity, { accountId: account.id, roleId: Number(item) });
            }
          }
        }).then(async () => {
          return '创建成功';
        }).catch((e) => {
          console.log('创建账号', e);
          throw new HttpException('创建失败', HttpStatus.OK);
        })
    } catch (e) {
      Logger.error(e, 'account.service');
      throw new HttpException(e, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 14:41:29
   * @LastEditors: 水痕
   * @Description: 根据用户id删除用户
   * @param {type} 
   * @return: 
   */
  async deleteAccountById(accountId: string, id: number): Promise<string> {
    if (Object.is(String(accountId), String(id))) {
      throw new HttpException('不能自己删除自己', HttpStatus.OK);
    }
    const { raw: { affectedRows } } = await this.accountRepository.update(id, { isDel: 1 });
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 15:02:52
   * @LastEditors: 水痕
   * @Description: 根据用户id修改密码
   * @param {type} 
   * @return: 
   */
  async modifyPassword(id: string, data: UpdatePasswordDto): Promise<any> {
    const { password, oldPassword, checkPassword } = data;
    if (!Object.is(password, checkPassword)) {
      throw new HttpException('两次密码不一致', HttpStatus.OK);
    }
    const account = await this.toolsService.findByIdOrUuid(id, this.accountRepository);
    if (account && this.toolsService.checkPassword(oldPassword, account.password)) {
      const { raw: { changedRows } } = await this.accountRepository
        .update({ id: account.id }, { password: this.toolsService.makePassword(password) });
      if (changedRows) {
        return await this.accountRepository.findOne({ id: Number(id) });
      } else {
        throw new HttpException('修改密码失败', HttpStatus.OK);
      }
    } else {
      throw new HttpException('修改密码失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 15:05:51
   * @LastEditors: 水痕
   * @Description: 根据用户id重置为默认密码
   * @param {type} 
   * @return: 
   */
  async resetPassword(id: number): Promise<any> {
    // 获取默认密码
    const definedPassword = this.configService.get('admin.defaultPassword') || '123456';
    const password = this.toolsService.makePassword(definedPassword);
    const { raw: { changedRows } } = await this.accountRepository.update({ id }, { password });
    if (changedRows) {
      return await this.accountRepository.findOne({ id: Number(id) });
    } else {
      throw new HttpException('重置密码失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 14:46:25
   * @LastEditors: 水痕
   * @Description: 根据用户id修改用户数据
   * @param {type} 
   * @return: 
   */
  async updateById(id: number, data: UpdateAccountDto): Promise<any> {
    try {
      const { username } = data;
      // 判断修改的不能重名
      const searchUsernameResult = await this.accountRepository.findOne({ where: { username } });
      if (searchUsernameResult && !Object.is(id, searchUsernameResult.id)) {
        throw new HttpException(`你修改的username:${username},数据库已经存在,不能重名`, HttpStatus.OK);
      }
      return getManager()
        .transaction(async (entityManager: EntityManager) => {
          // 修改账号信息
          const { roles, ...oths } = data;
          await entityManager.update(AccountEntity, id, oths);
          // 如果角色有就添加角色
          const rolesList = roles.split(',');
          // 删除之前的
          await entityManager.delete(AccountRoleEntity, { accountId: id });
          if (roles) {
            // 新增现在的
            for (const item of rolesList) {
              await entityManager.save(AccountRoleEntity, { accountId: id, roleId: Number(item) });
            }
          }
        }).then(async () => {
          return '修改成功';
        }).catch((e) => {
          console.log('修改账号', e);
          throw new HttpException('修改失败', HttpStatus.OK);
        })
    } catch (e) {
      throw new HttpException('修改失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 14:59:14
   * @LastEditors: 水痕
   * @Description: 根据用户id查询用户信息
   * @param {type} 
   * @return: 
   */
  async findById(id: number): Promise<any> {
    const account = await await getConnection().createQueryBuilder(AccountEntity, 'account')
      .andWhere('(account.id= :id and account.isDel=0)', { id })
      .leftJoin(AccountRoleEntity, 'account_role', 'account.id=account_role.accountId') // 中间表
      .leftJoinAndMapMany('user.role', RoleEntity, 'role', 'account_role.role_id=role.id')
      .leftJoinAndMapOne('account.platformDict', DictConfigEntry, 'dict', 'account.platform=dict.id')
      .getOne();
    return account.toResponseObject();
  }


  /**
   * @Author: 水痕
   * @Date: 2020-05-18 15:11:19
   * @LastEditors: 水痕
   * @Description: 分页查询用户列表
   * @param {type} 
   * @return: 
   */
  async accountList(queryOption: ObjectType): Promise<any> {
    // eslint-disable-next-line prefer-const
    const { pageSize = 10, pageNumber = 1, username, mobile, email, status, name, platform } = channelObject(queryOption);
    this.toolsService.checkPage(pageSize, pageNumber);
    const queryConditionList = ['account.isDel = 0 and account.id > 1'];
    if (username) {
      queryConditionList.push('account.username LIKE :username');
    }
    if (mobile) {
      queryConditionList.push('account.mobile = :mobile');
    }
    if (email) {
      queryConditionList.push('account.email = :email');
    }
    if (status) {
      queryConditionList.push('account.status = :status')
    }
    if (name) {
      queryConditionList.push('account.name LIKE :name')
    }
    if (platform) {
      queryConditionList.push('account.platform = :platform')
    }
    const queryCondition = queryConditionList.join(' AND ');
    const [data, total] = await getConnection().createQueryBuilder(AccountEntity, 'account')
      .andWhere(queryCondition, { username: `%${username}%`, mobile, email, status, name: `%${name}%`, platform })
      .orderBy({ 'account.id': 'DESC' })
      .leftJoin(AccountRoleEntity, 'account_role', 'account.id=account_role.account_id') // 中间表
      .leftJoinAndMapMany('account.roles', RoleEntity, 'role', 'account_role.role_id=role.id and role.isDel=0') //
      .leftJoinAndMapOne('account.platformDict', DictConfigEntry, 'dict', 'account.platform=dict.id')
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();
    return {
      data: data.map((item: ObjectType) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, mobile, email, username, simpNodeAuth, ...others } = item;
        return Object.assign(others, {
          mobile: this.toolsService.isUUID(mobile) ? '' : mobile,
          email: this.toolsService.isUUID(email) ? '' : email,
          username: this.toolsService.isUUID(username) ? '' : username,
        });
      }),
      total,
      pageNumber,
      pageSize,
    }
  }


  /**
   * @Author: 水痕
   * @Date: 2020-07-16 17:38:54
   * @LastEditors: 水痕
   * @Description: 根据用户id查询用户拥有的资源
   * @param {type} 
   * @return: 
   */
  async accountIncludeAccess(accountId: string) {
    return getConnection().createQueryBuilder(AccountEntity, 'account')
      .select(['account.id'])
      .where('account.id=:id and account.isDel=0', { id: Number(accountId) })
      .innerJoin(AccountRoleEntity, 'account_role', 'account.id=account_role.accountId')
      .innerJoin(RoleAccessEntity, 'role_access', 'account_role.roleId=role_access.roleId')
      .innerJoinAndMapMany('account.access', AccessEntity, 'access', 'role_access.accessId=access.id and access.isDel=0')
      .getOne()
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 14:52:46
   * @LastEditors: 水痕
   * @Description: 根据一个类型去查询数据
   * @param {type} 
   * @return: 
   */
  private async findOne(filesName: string, value: string): Promise<any> {
    return await this.accountRepository.findOne({ where: { [filesName]: value } });
  }

}
