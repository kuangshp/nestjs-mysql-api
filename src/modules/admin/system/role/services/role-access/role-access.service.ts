import { RoleAccessEntity } from './../../entities/role.access.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleAccessResDto } from '../../controllers/role-access/dto/role.access.res.dto';

@Injectable()
export class RoleAccessService {
  constructor(
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository:Repository<RoleAccessEntity>
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 21:35:59
   * @LastEditors: 水痕
   * @Description: 根据角色id返回授权的资源列表
   * @param {*}
   * @return {*}
   */
  async accessListByRoleId(roleId: number): Promise<RoleAccessResDto[]> {
    return await this.roleAccessRepository.find({where: {roleId}, select: ['id', 'accessId']});
  }
}
