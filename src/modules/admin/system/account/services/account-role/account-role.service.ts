import { RoleEntity } from './../../../role/entities/role.entity';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRoleEntity } from '../../entities/account.role.entity';
import { Repository, getManager, EntityManager, getConnection } from 'typeorm';
import {
  AccountRoleListVo,
  RoleAccountListVo,
} from '../../controllers/account-role/vo/account.role.vo';
import { DistributionRoleDto } from '../../controllers/account-role/dto/distribution.role.dto';

@Injectable()
export class AccountRoleService {
  private readonly logger: Logger = new Logger(AccountRoleService.name);
  constructor(
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 16:08:47
   * @LastEditors: 水痕
   * @Description: 根据账号id获取授权的角色列表
   * @param {number} accountId
   * @return {*}
   */
  async accountRoleListByAccountId(accountId: number): Promise<AccountRoleListVo[] | undefined> {
    return await this.accountRoleRepository.find({
      where: { accountId },
      select: ['id', 'roleId'],
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 18:01:44
   * @LastEditors: 水痕
   * @Description: 给账号分配角色
   * @param {DistributionRoleDto} distributionRoleDto
   * @return {*}
   */
  async distributionRole(distributionRoleDto: DistributionRoleDto): Promise<string> {
    const { accountId, roleList } = distributionRoleDto;
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        await entityManager.delete<AccountRoleEntity>(AccountRoleEntity, { accountId });
        for (const item of roleList) {
          const result: AccountRoleEntity = entityManager.create<AccountRoleEntity>(
            AccountRoleEntity,
            {
              accountId,
              roleId: item,
            },
          );
          await entityManager.save(result);
        }
      })
      .then(() => {
        return '分配角色成功';
      })
      .catch((e: HttpException) => {
        this.logger.error('给账号分配角色错误', e.message);
        throw new HttpException(`给账号分配角色失败:${e.message}`, HttpStatus.OK);
      });
  }

  /**
   * @Author: 水痕
   * @Date: 2021-04-03 10:43:55
   * @LastEditors: 水痕
   * @Description: 获取全部的角色
   * @param {*}
   * @return {*}
   */
  async roleList(): Promise<RoleAccountListVo[]> {
    return await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .select(['role.id', 'role.name'])
      .getMany();
  }
}
