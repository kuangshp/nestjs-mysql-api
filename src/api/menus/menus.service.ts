import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUserType } from '@src/decorators';
import { StatusEnum } from '@src/enums';
import { mapToObj } from '@src/utils';
import { FindOperator, In, Repository } from 'typeorm';
import { AccountRoleEntity } from '../accountRole/entities/account.role.entity';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { RoleResourcesEntity } from '../roleResources/entities/role.resources.entity';
import { MenusVo } from './vo/menus.vo';

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
    // 如果是超级管理员就全部返回
    const query = new Map<string, FindOperator<string>>();
    query.set('status', StatusEnum.NORMAL as any);
    // if (userInfo.isSuper !== SuperAdminEnum.IS_SUPER) {
    //   const resourcesId = await this.getResourcesIdList(userInfo);
    //   query.set('id', In(resourcesId));
    // }
    console.log(userInfo);
    return await this.resourcesRepository
      .createQueryBuilder('resources')
      .where(mapToObj(query))
      .orderBy({ sort: 'ASC' })
      .getMany();
  }

  /**
   * @Author:
   * @Date: 2023-05-20 17:19:02
   * @LastEditors:
   * @Description: 根据菜单url获取菜单id
   * @param {string} urlName
   * @return {*}
   */
  async getMenusIdByNameApi(urlName: string): Promise<number | undefined> {
    const resourcesEntity = await this.resourcesRepository.findOne({
      where: { url: urlName },
      select: ['id'],
    });
    return resourcesEntity?.id ?? 0;
  }

  /**
   * @Author:
   * @Date: 2023-05-20 17:02:48
   * @LastEditors:
   * @Description: 根据菜单id获取授权的按钮
   * @param {number} id
   * @return {*}
   */
  async getBtnByMenusIdApi(id: number, userInfo: ICurrentUserType): Promise<ResourcesEntity[]> {
    // if (Object.is(userInfo.isSuper, SuperAdminEnum.IS_SUPER)) {
    //   return await this.resourcesRepository.find({
    //     where: { parentId: id, resourcesType: 1 },
    //     order: { sort: 'DESC', id: 'DESC' },
    //   });
    // } else {

    // }
    // 获取授权的资源id
    const resourcesId = await this.getResourcesIdList(userInfo);
    return await this.resourcesRepository.find({
      where: { id: In(resourcesId), resourcesType: 1, parentId: id },
      order: { sort: 'DESC', id: 'DESC' },
    });
  }

  /**
   * @Author:
   * @Date: 2023-05-20 19:52:18
   * @LastEditors:
   * @Description: 根据资源id获取咨询
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
    // 1.查询当前用户授权的角色
    const accountRoleEntity: Pick<AccountRoleEntity, 'roleId'>[] =
      await this.accountRoleRepository.find({
        where: { accountId: userInfo.id },
        select: ['roleId'],
      });
    if (!accountRoleEntity.length) {
      return [];
    }
    // 2.根据角色查询授权的资源
    const roleResourcesEntity: Pick<RoleResourcesEntity, 'resourcesId'>[] =
      await this.roleResourcesRepository.find({
        where: { roleId: In(accountRoleEntity.map((item) => item.roleId)) },
        select: ['resourcesId'],
      });
    if (!roleResourcesEntity.length) {
      return [];
    }
    return roleResourcesEntity.map((item) => item.resourcesId);
  }
}
