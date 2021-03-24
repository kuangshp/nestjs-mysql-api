import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessEntity } from '../../entities/access.entity';
import { Repository } from 'typeorm';
import { MenusListResDto } from '../../controllers/menus/dto/menus.res.dto';
import { ICurrentUserType } from '@src/decorators/current.user';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly accessRepository:Repository<AccessEntity>,
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 14:43:40
   * @LastEditors: 水痕
   * @Description: 获取菜单列表
   * @param {ICurrentUserType} userInfo
   * @return {*}
   */
  async menusList(userInfo: ICurrentUserType): Promise<any> {
    /**
     * 根据用户权限来返回菜单
     * 1.如果是超级管理员就返回全部菜单
     * 2.非超级管理员，根据当前用户拥有的角色去查询(角色资源)表获取全部的资源
     */
    return [];
  }
}
