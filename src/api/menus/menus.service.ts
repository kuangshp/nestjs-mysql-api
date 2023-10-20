import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUserType } from '@src/decorators';
import { StatusEnum } from '@src/enums';
import { AccountTypeEnum } from '@src/enums/account.type.enum';
import { mapToObj } from '@src/utils';
import { FindOperator, In, Repository } from 'typeorm';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { MenusRepository } from './menus.repository';
import { ApiVo, MenusVo } from './vo/menus.vo';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(ResourcesEntity)
    private readonly resourcesRepository: Repository<ResourcesEntity>,
    private readonly menusRepository: MenusRepository
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
      const resourcesIdList = await this.menusRepository.getResourcesIdList(userInfo, 0);
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
    if (!resourcesEntity?.id) {
      return [];
    }
    // 获取授权的资源id
    const resourcesId = await this.menusRepository.getResourcesIdList(userInfo, 1);
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
    const resourcesId = await this.menusRepository.getResourcesIdList(userInfo, 0);
    return await this.resourcesRepository.find({
      where: { id: In(resourcesId) },
    });
  }
}
