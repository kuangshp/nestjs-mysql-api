import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUserType } from '@src/decorators';
import { StatusEnum } from '@src/enums';
import { AccountTypeEnum } from '@src/enums/account.type.enum';
import { mapToObj } from '@src/utils';
import { FindOperator, In, Repository } from 'typeorm';
import { AccountRoleEntity } from '../accountRole/entities/account.role.entity';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { RoleResourcesEntity } from '../roleResources/entities/role.resources.entity';
import { ApiVo, MenusVo } from './vo/menus.vo';

@Injectable()
export class MenusService {
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
   * @Date: 2023-05-20 16:20:34
   * @LastEditors:
   * @Description: 获取当前用户授权的菜单
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  async getAllMenusApi(userInfo: ICurrentUserType): Promise<MenusVo[]> {
    const { accountType } = userInfo;
    const query = new Map<string, FindOperator<string>>();
    query.set('status', StatusEnum.NORMAL as any);
    query.set('resourcesType', In([0, 1]));
    // 如果是不是超级管理员就返回角色下的资源
    if (accountType !== AccountTypeEnum.SUPER_ACCOUNT) {
      const resourcesIdList = await this.getResourcesIdList(userInfo);
      console.log(resourcesIdList, '资源');
      query.set('id', In(resourcesIdList));
    }
    console.log(userInfo);
    return await this.resourcesRepository
      .createQueryBuilder('resources')
      .where(mapToObj(query))
      .orderBy({ sort: 'ASC' })
      .getMany();
  }

  /**
   * @Author:
   * @Date: 2023-05-20 17:02:48
   * @LastEditors:
   * @Description: 根据菜单id获取授权的按钮
   * @param {string} urlName
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  async getBtnByMenusUrlApi(urlName: string, userInfo: ICurrentUserType): Promise<ApiVo[]> {
    const resourcesEntity: Pick<ResourcesEntity, 'id'> | null =
      await this.resourcesRepository.findOne({
        where: { url: urlName },
        select: ['id'],
      });
    console.log(resourcesEntity, '????');
    if (!resourcesEntity?.id) {
      return [];
    }
    // 获取授权的资源id
    const resourcesId = await this.getResourcesIdList(userInfo);
    console.log(resourcesId, '全部资源');
    return await this.resourcesRepository.find({
      where: {
        id: In(resourcesId),
        resourcesType: 2,
        parentId: resourcesEntity?.id,
        status: StatusEnum.NORMAL,
      },
      order: { sort: 'ASC', id: 'DESC' },
      select: ['id', 'title'],
    });
  }

  /**
   * @Author:
   * @Date: 2023-05-20 19:52:18
   * @LastEditors:
   * @Description: 根据资源id获取资源
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  async getResourcesList(userInfo: ICurrentUserType): Promise<ResourcesEntity[]> {
    const resourcesId = await this.getResourcesIdList(userInfo);
    return await this.resourcesRepository.find({
      where: { id: In(resourcesId) },
    });
  }
  /**
   * @Author:
   * @Date: 2023-05-20 17:08:22
   * @LastEditors:
   * @Description: 内部使用,根据当前用户获取授权的资源id
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  private async getResourcesIdList(userInfo: ICurrentUserType): Promise<number[]> {
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
