import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessEntity } from '../../entities/access.entity';
import { Repository, getConnection } from 'typeorm';
import { MenusListResDto } from '../../controllers/menus/dto/menus.res.dto';
import { ICurrentUserType } from '@src/decorators/current.user';
import { AccountEntity } from '../../../account/entities/account.entity';
import { AdminIdentityEnum } from '@src/enums';

@Injectable()
export class MenusService {
  constructor (
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 14:43:40
   * @LastEditors: 水痕
   * @Description: 获取菜单列表
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  async menusList(userInfo: ICurrentUserType): Promise<MenusListResDto[]> {
    /**
     * 根据用户权限来返回菜单
     * 1.查询全部的菜单
     * 2.如果是超级管理员就返回全部菜单
     * 3.非超级管理员，根据当前用户拥有的角色去查询(角色资源)表获取全部的资源
     */
    const { id } = userInfo;
    const accountInfo: AccountEntity | undefined = await getConnection().createQueryBuilder(AccountEntity, 'account')
      .select([])
      .addSelect('account.isSuper', 'isSuper')
      .where('account.id = :id', { id })
      .getRawOne();
    // 1.查询全部的菜单
    const accessList: AccessEntity[] = await this.accessRepository.find({ where: [{ type: 1 }, { type: 2 }] });
    // 1.1格式化菜单
    const formatMenus: MenusListResDto[] = accessList.map((item: AccessEntity) => {
      const { id, moduleName, actionName, parentId, url, sort, icon } = item;
      return {
        id,
        name: moduleName ? moduleName : actionName,
        parentId,
        url,
        sort,
        icon
      }
    });
    // 超级管理员就全部返回
    if (Object.is(accountInfo?.isSuper, AdminIdentityEnum.SUPPER)) {
      return formatMenus;
    }
    // 2.根据当前账号ID查询分配的角色-->根据已分配的角色ID查询角色资源表获取全部的资源
    return formatMenus;
  }
}
