import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUserType } from '@src/decorators';
import { AccountTypeEnum } from '@src/enums/account.type.enum';
import { mapToObj } from '@src/utils';
import { Repository, FindOperator, In } from 'typeorm';
import { AccountRoleEntity } from '../accountRole/entities/account.role.entity';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { RoleResourcesEntity } from '../roleResources/entities/role.resources.entity';

@Injectable()
export class MenusRepository {
  constructor(
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
    @InjectRepository(RoleResourcesEntity)
    private readonly roleResourcesRepository: Repository<RoleResourcesEntity>,
    @InjectRepository(ResourcesEntity)
    private readonly resourcesRepository: Repository<ResourcesEntity>
  ) {}

  /**
   * @Author:
   * @Date: 2023-05-20 17:08:22
   * @LastEditors:
   * @Description: 内部使用,根据当前用户获取授权的资源id
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  async getResourcesIdList(userInfo: ICurrentUserType): Promise<number[]> {
    const { accountType } = userInfo;
    if (accountType == AccountTypeEnum.SUPER_ACCOUNT) {
      const resourcesEntity: Pick<ResourcesEntity, 'id'>[] = await this.resourcesRepository.find({
        select: ['id'],
      });
      return resourcesEntity.map((item: Pick<ResourcesEntity, 'id'>) => item.id);
    } else {
      const query = new Map<string, FindOperator<string>>();
      // 1.查询当前用户授权的角色
      const accountRoleEntity: Pick<AccountRoleEntity, 'roleId'>[] =
        await this.accountRoleRepository.find({
          where: { accountId: userInfo.id },
          select: ['roleId'],
        });
      if (!accountRoleEntity.length) {
        return [];
      }
      query.set('roleId', In(accountRoleEntity.map((item) => item.roleId)));
      // 2.根据角色查询授权的资源
      const roleResourcesEntity: Pick<RoleResourcesEntity, 'resourcesId'>[] =
        await this.roleResourcesRepository.find({
          where: mapToObj(query),
          select: ['resourcesId'],
        });
      if (!roleResourcesEntity.length) {
        return [];
      }
      return roleResourcesEntity.map((item) => item.resourcesId);
    }
  }
}
