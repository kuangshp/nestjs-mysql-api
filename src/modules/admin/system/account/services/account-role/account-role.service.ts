import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRoleEntity } from '../../entities/account.role.entity';
import { Repository } from 'typeorm';
import { AccountRoleListResDto } from '../../controllers/account-role/dto/account.role.res.dto';
import { DistributionRoleDto } from '../../controllers/account-role/dto/distribution.role.dto';

@Injectable()
export class AccountRoleService {
  constructor(
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository:Repository<AccountRoleEntity>,
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 16:08:47
   * @LastEditors: 水痕
   * @Description: 根据账号id获取授权的角色列表
   * @param {number} accountId
   * @return {*}
   */
  async accountRoleListByAccountId(accountId: number): Promise<AccountRoleListResDto[] | undefined> {
    return await this.accountRoleRepository.find({ where: { accountId }, select: ['id', 'roleId'] });
  }

  async distributionRole(distributionRoleDto: DistributionRoleDto):Promise<any> {
    console.log(distributionRoleDto);
  }
}
