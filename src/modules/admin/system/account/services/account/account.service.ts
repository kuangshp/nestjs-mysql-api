import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isMobilePhone, isEmail } from 'class-validator';
import { Repository, getConnection } from 'typeorm';

import { AccountEntity } from '../../entities/account.entity';
import { CreateAccountDto } from '../../controllers/account/dto/create.account.dto';
import adminConfig from '@src/config/admin.config';
import { usernameReg } from '@src/constants';
import { UpdateAccountDto } from '../../controllers/account/dto/update.account.dto';
import { ModifyPasswordDto } from '../../controllers/account/dto/modify.password.dto';
import { ToolsService } from '@src/modules/shared/services/tools/tools.service';
import { AccountResDto, AccountListResDtoDto } from '../../controllers/account/dto/account.res.dto';
import { AccountReqDto } from '../../controllers/account/dto/account.req.dto';
import { PageEnum, StatusEnum, PlatformEnum } from '@src/enums';
import { AccountLastLoginEntity } from '../../entities/account.last.login.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly toolsService: ToolsService,
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 08:36:42
   * @LastEditors: 水痕
   * @Description: 创建账号
   * @param {CreateAccountDto} createAccountDto
   * @return {*}
   */
  async createAccount(createAccountDto: CreateAccountDto): Promise<string> {
    const { username, email, mobile } = createAccountDto;
    const queryConditionList = [];
    if (username) {
      queryConditionList.push('account.username = :username');
    }
    if (email) {
      queryConditionList.push('account.email = :email');
    }
    if (mobile) {
      queryConditionList.push('account.mobile = :mobile');
    }
    const queryCondition = queryConditionList.join(' OR ');
    const findAccount = await getConnection()
      .createQueryBuilder(AccountEntity, 'account')
      .select(['account.username', 'account.email', 'account.mobile'])
      .andWhere(queryCondition, { username, email, mobile })
      .getOne();
    if (findAccount) {
      const { username, email, mobile } = findAccount;
      if (usernameReg.test(username)) {
        return '创建失败,已经存在该用户名';
      } else if (isMobilePhone(mobile, 'zh-CN')) {
        return '创建失败,已经存在该手机号码';
      } else if (isEmail(email)) {
        return '创建失败,已经存在该邮箱号';
      } else {
        return '创建失败';
      }
    } else {
      const account = this.accountRepository.create({
        ...createAccountDto,
        password: adminConfig.defaultPassword,
      });
      await this.accountRepository.save(account);
      return '创建成功';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-04-02 21:22:21
   * @LastEditors: 水痕
   * @Description: 根据用户id重置为默认密码
   * @param {*}
   * @return {*}
   */
  async resetPassword(id: number): Promise<string> {
    const {
      raw: { affectedRows },
    } = await this.accountRepository.update(id, {
      password: this.toolsService.makePassword(adminConfig.defaultPassword),
    });
    if (affectedRows) {
      return '重置成功';
    } else {
      return '重置失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 09:01:05
   * @LastEditors: 水痕
   * @Description: 根据id删除账号
   * @param {number} id
   * @return {*}
   */
  async destroyById(id: number): Promise<string> {
    if (id === 1) {
      throw new HttpException('系统默认生成的账号不能删除', HttpStatus.OK);
    }
    const {
      raw: { affectedRows },
    } = await this.accountRepository.softDelete(id);
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 11:12:40
   * @LastEditors: 水痕
   * @Description: 根据账号id修改密码
   * @param {number} id
   * @param {ModifyPasswordDto} modifyPasswordDto
   * @return {*}
   */
  async modifyPassWordById(id: number, modifyPasswordDto: ModifyPasswordDto): Promise<string> {
    if (id === 1) {
      throw new HttpException('系统默认生成的账号不能修改密码', HttpStatus.OK);
    }
    const { password, newPassword } = modifyPasswordDto;
    const findResult = await getConnection()
      .createQueryBuilder(AccountEntity, 'account')
      .select([])
      .addSelect('account.password', 'password')
      .where('(account.id = :id)', { id })
      .getRawOne();
    if (findResult?.password && this.toolsService.checkPassword(password, findResult?.password)) {
      const {
        raw: { affectedRows },
      } = await this.accountRepository.update(id, {
        password: this.toolsService.makePassword(newPassword),
      });
      if (affectedRows) {
        return '修改成功';
      } else {
        return '修改失败';
      }
    } else {
      throw new HttpException('你输入的旧密码错误或输入的账号id不存在', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 10:57:46
   * @LastEditors: 水痕
   * @Description: 根据账号id修改账号信息
   * @param {number} id
   * @param {UpdateAccountDto} updateAccountDto
   * @return {*}
   */
  async modifyById(id: number, updateAccountDto: UpdateAccountDto): Promise<string> {
    if (id === 1) {
      throw new HttpException('系统默认生成的账号不能修改信息', HttpStatus.OK);
    }
    const { username, email, mobile, status, platform } = updateAccountDto;
    const result = await this.accountRepository.findOne(id);
    await this.accountRepository.save(
      Object.assign(result, { username, email, mobile, status, platform }),
    );
    return '修改成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 11:56:52
   * @LastEditors: 水痕
   * @Description: 根据账号id查询账号信息
   * @param {number} id
   * @return {*}
   */
  async accountById(id: number): Promise<AccountResDto | undefined> {
    return await this.accountRepository.findOne(id);
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 13:02:35
   * @LastEditors: 水痕
   * @Description: 根据条件查询账号列表
   * @param {AccountReqDto} accountReqDto
   * @return {*}
   */
  async accountList(accountReqDto: AccountReqDto): Promise<AccountListResDtoDto> {
    const {
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      email,
      username,
      mobile,
      status,
      platform,
    } = accountReqDto;
    const queryConditionList = [];
    if (username) {
      queryConditionList.push('account.username LIKE :username');
    }
    if (email) {
      queryConditionList.push('account.email = :email');
    }
    if (mobile) {
      queryConditionList.push('account.mobile = :mobile');
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    if (
      /^\d$/.test(String(status)) &&
      [StatusEnum.NORMAL, StatusEnum.FORBIDDEN].includes(Number(status))
    ) {
      queryConditionList.push('account.status = :status');
    }
    if (
      /^\d$/.test(String(platform)) &&
      [PlatformEnum.ADMIN_PLATFORM, PlatformEnum.MERCHANT_PLATFORM].includes(Number(platform))
    ) {
      queryConditionList.push('account.platform = :platform');
    }
    const queryCondition = queryConditionList.join(' AND ');
    const data = await getConnection()
      .createQueryBuilder(AccountEntity, 'account')
      .select('account.id', 'id')
      .addSelect('account.username', 'username')
      .addSelect('account.mobile', 'mobile')
      .addSelect('account.email', 'email')
      .addSelect('account.status', 'status')
      .addSelect('account.platform', 'platform')
      .addSelect('account.isSuper', 'isSuper')
      .addSelect('account.createdAt', 'createdAt')
      .addSelect('account.updatedAt', 'updatedAt')
      .addSelect(
        (qb) =>
          qb
            .select('lastLogin.lastLoginIp')
            .from(AccountLastLoginEntity, 'lastLogin')
            .where('(lastLogin.accountId = account.id)')
            .orderBy({ 'lastLogin.id': 'DESC' })
            .limit(1),
        'lastLoginIp',
      )
      .addSelect(
        (qb) =>
          qb
            .select('lastLogin.lastLoginAddress')
            .from(AccountLastLoginEntity, 'lastLogin')
            .where('(lastLogin.accountId = account.id)')
            .orderBy({ 'lastLogin.id': 'DESC' })
            .limit(1),
        'lastLoginAddress',
      )
      .addSelect(
        (qb) =>
          qb
            .select('lastLogin.lastLoginTime')
            .from(AccountLastLoginEntity, 'lastLogin')
            .where('(lastLogin.accountId = account.id)')
            .orderBy({ 'lastLogin.id': 'DESC' })
            .limit(1),
        'lastLoginTime',
      )
      .where(queryCondition, { username, email, mobile, status, platform })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getRawMany();
    const total = await getConnection()
      .createQueryBuilder(AccountEntity, 'account')
      .where(queryCondition, { username, email, mobile, status, platform })
      .getCount();
    // 处理当前手机号码或者邮箱不合法的时候
    const formatData = data.map((item) => {
      const { username, mobile, email } = item;
      return {
        ...item,
        mobile: isMobilePhone(mobile, 'zh-CN') ? mobile : '',
        email: isEmail(email) ? email : '',
        username: usernameReg.test(username) ? username : '',
      };
    });
    return {
      data: formatData,
      total,
      pageSize,
      pageNumber,
    };
  }
}
