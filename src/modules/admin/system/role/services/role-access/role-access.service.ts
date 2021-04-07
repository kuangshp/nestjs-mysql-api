import { AccessEntity } from './../../../access/entities/access.entity';
import { AccessTypeEnum } from './../../../../../../enums/access.type.enum';
import { RoleAccessEntity } from './../../entities/role.access.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import { RoleAccessResDto } from '../../controllers/role-access/dto/role.access.res.dto';
import { RoleAccessReqDto } from '../../controllers/role-access/dto/role.access.req.dto';
import { AllMenusResDto } from '../../controllers/role-access/dto/all.menus.res.dto';
import { AllApiResDto } from '../../controllers/role-access/dto/all.api.res.dto';

@Injectable()
export class RoleAccessService {
  constructor(
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 21:49:26
   * @LastEditors: 水痕
   * @Description: 给当前角色ID授权菜单、接口权限
   * @param {*}
   * @return {*}
   */
  async roleToAccess(roleId: number, roleAccessReqDto: RoleAccessReqDto): Promise<string> {
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        const { accessList, type } = roleAccessReqDto;
        await entityManager.delete<RoleAccessEntity>(RoleAccessEntity, { roleId, type });
        const newAccessList = accessList.map((item: number) => {
          return {
            roleId,
            type,
            accessId: item,
          };
        });
        const result = entityManager.create<RoleAccessEntity>(RoleAccessEntity, newAccessList);
        await entityManager.save<RoleAccessEntity>(result);
      })
      .then(() => {
        return '分配菜单权限成功';
      })
      .catch((e: HttpException) => {
        throw new HttpException(e, HttpStatus.OK);
      });
  }

  /**
   * @Author: 水痕
   * @Date: 2021-04-05 15:45:01
   * @LastEditors: 水痕
   * @Description: 获取全部的菜单,可授权的
   * @param {*}
   * @return {*}
   */
  async allMenus(): Promise<AllMenusResDto[]> {
    const menusList = await this.accessRepository.find({
      where: [{ type: AccessTypeEnum.MODULE }, { type: AccessTypeEnum.MENUS }],
      select: ['id', 'moduleName', 'actionName', 'parentId'],
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
    return menusList.map((item: AccessEntity) => {
      return {
        id: item.id,
        key: String(item.id),
        title: item.moduleName ? item.moduleName : item.actionName,
        parentId: item.parentId,
      };
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2021-04-05 21:14:57
   * @LastEditors: 水痕
   * @Description: 获取全部的API
   * @param {*}
   * @return {*}
   */
  async allApi(): Promise<AllApiResDto[]> {
    return await this.accessRepository.find({
      where: { type: AccessTypeEnum.OPERATION },
      select: ['id', 'apiName'],
      order: { sort: 'ASC', createdAt: 'DESC' },
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 21:35:59
   * @LastEditors: 水痕
   * @Description: 根据角色id返回授权的资源列表
   * @param {*}
   * @return {*}
   */
  async accessListByRoleId(roleId: number, type: number): Promise<RoleAccessResDto[]> {
    return await this.roleAccessRepository.find({
      where: { roleId, type },
      select: ['id', 'accessId'],
    });
  }
}
