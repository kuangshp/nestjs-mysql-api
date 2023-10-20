import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountRoleEntity } from './entities/account.role.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { RoleEntity } from '../role/entities/role.entity';
import { AccountRoleDto } from './dto/account.role.dto';
import { StatusEnum } from '@src/enums';
import { getC, getJ } from '@src/utils';
import { ICurrentUserType } from '@src/decorators';

@Injectable()
export class AccountRoleService {
  constructor(
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private dataSource: DataSource
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 07:43:07
   * @LastEditors: 水痕
   * @Description: 给账号分配角色
   * @param {AccountRoleDto} req
   * @return {*}
   */
  async distributionRoleApi(req: AccountRoleDto): Promise<string> {
    // 如果传递过来的角色列表为空的时候，直接清空
    if (req.roleList.length == 0) {
      const { affected } = await this.accountRoleRepository.delete({
        accountId: req.accountId,
      });
      if (affected) {
        return '删除成功';
      } else {
        return '删除失败';
      }
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // 开启事物
    try {
      // 1.根据账号去查询历史分配的角色id
      const accountRoleEntity: Pick<AccountRoleEntity, 'roleId'>[] =
        await this.accountRoleRepository.find({
          where: { accountId: req.accountId },
          select: ['roleId'],
        });
      console.log(accountRoleEntity, '查询数据');
      if (accountRoleEntity.length) {
        const oldRoleIdList = accountRoleEntity.map((item) => item.roleId);
        // 利用交集计算需要保留下来的
        const roleIdList = getJ(oldRoleIdList, req.roleList);
        // 计算需要删除的
        const roleIdDeleteList = getC(roleIdList, oldRoleIdList);
        // 计算需要创建的
        const createRoleList = getC(roleIdList, req.roleList);
        if (createRoleList.length) {
          const createAccountRoleData = createRoleList.map((item: number) => {
            return {
              accountId: req.accountId,
              roleId: item,
            };
          });
          // 创建
          const data = queryRunner.manager.create<AccountRoleEntity>(
            AccountRoleEntity,
            createAccountRoleData
          );
          await queryRunner.manager.save<AccountRoleEntity>(data);
        }

        if (roleIdDeleteList.length) {
          // 删除
          const accountRoleEntity1 = await this.accountRoleRepository.find({
            where: { accountId: req.accountId, roleId: In(roleIdDeleteList) },
            select: ['id'],
          });
          await queryRunner.manager.delete<AccountRoleEntity>(
            AccountRoleEntity,
            accountRoleEntity1.map((item) => item.id)
          );
        }
      } else {
        console.log('进来了2');
        const createAccountRoleData = req.roleList.map((item) => {
          return {
            accountId: req.accountId,
            roleId: item,
          };
        });
        // 创建
        const data = queryRunner.manager.create<AccountRoleEntity>(
          AccountRoleEntity,
          createAccountRoleData
        );
        await queryRunner.manager.save<AccountRoleEntity>(data);
      }
      await queryRunner.commitTransaction(); // 提交事务
      return '分配角色成功';
    } catch (err) {
      await queryRunner.rollbackTransaction(); // 回滚操作
      throw new HttpException('分配角色失败', HttpStatus.OK);
    } finally {
      // 最后你需要释放一个手动实例化的queryRunner
      await queryRunner.release();
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 07:44:16
   * @LastEditors: 水痕
   * @Description: 根据账号id获取授权的角色
   * @param {number} accountId
   * @return {*}
   */
  async getRoleByAccountIdApi(accountId: number): Promise<RoleEntity[]> {
    const accountRoleEntity: Pick<AccountRoleEntity, 'roleId'>[] =
      await this.accountRoleRepository.find({
        where: { accountId },
        select: ['roleId'],
      });
    const roleIdList = accountRoleEntity.map(
      (item: Pick<AccountRoleEntity, 'roleId'>) => item.roleId
    );
    // 根据角色id查询全部的角色
    return await this.roleRepository.find({
      where: { id: In(roleIdList) },
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 07:44:52
   * @LastEditors: 水痕
   * @Description: 获取全部角色
   * @param {number} status
   * @param {ICurrentUserType} currentInfo
   * @return {*}
   */
  async getAllRolesApi(status: number, currentInfo: ICurrentUserType): Promise<RoleEntity[]> {
    if ([StatusEnum.NORMAL, StatusEnum.FORBIDDEN].includes(+status)) {
      return this.roleRepository.find({ where: { status, accountId: currentInfo.id } });
    } else {
      return this.roleRepository.find({ where: { accountId: currentInfo.id } });
    }
  }
}
