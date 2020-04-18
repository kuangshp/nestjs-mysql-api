import { Injectable } from '@nestjs/common';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { ObjectType } from '@src/types';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleAccessEntity } from '@src/entities/role_access.entity';
import { Repository } from 'typeorm';
import { AccessEntity } from '@src/entities/access.entity';

@Injectable()
export class AuthService {
  constructor (
    @InjectConfig() private readonly configService: ConfigService,
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) { }
  /**
   * @Author: 水痕
   * @Date: 2020-01-10 16:15:08
   * @LastEditors: 水痕
   * @Description: 检查当前用户的权限
   * @param {type} 
   * @return: 
   * 主要步骤
   * 1.获取获取用户的角色(如果是超级管理员就跳过权限判断admin_user表中is_super=1的用户)
   * 2.根据当前角色获取角色权限列表(admin_role_access)
   * 3.获取当前的url对应的权限id
   * 4.判断当前访问的url对应的权限id,是否在权限列表的id里面
   */
  async checkAuth(userinfo: ObjectType, req: any): Promise<boolean> {
    // 1.获取当前访问的角色id及是否为超级用户
    const { roleId, isSuper } = userinfo;
    // 1.1如果的超级管理员或者是登录或者退出的接口不进行权限校验
    if (isSuper) {
      return true;
    }
    // 2.根据当前角色id查询到role_access表中的全部权限
    let roleAccessResult: any = await this.roleAccessRepository.find({ roleId })
    // 全部的权限id(包括模块、菜单、操作)
    let accessIds = roleAccessResult.map((item: { access_id: number }) => item.access_id)
    // 如果是菜单的就直接返回true
    const { url, method } = req;
    const pathname = url.replace('/api/v1/admin/', '');
    if (pathname == 'access/menus') {
      return true;
    }
    // 3.用当前用户请求的url去access查询是否有该url的权限 
    let accessUrlResult = await this.accessRepository
      .createQueryBuilder('ac')
      .andWhere('(ac.url LIKE :pathname AND ac.method= :method)', { pathname: `%${pathname}%`, method: method.toUpperCase() })
      .select('ac.id')
      .printSql()
      .getOne();
    // let accessUrlResult = await this.accessRepository.query(`select * from access where url like '%${pathname}%' and method='${method.toUpperCase()}';`);
    if (accessUrlResult) {
      // 4.判断当前的url获取的权限是否在accessIds中
      if (accessIds.includes(accessUrlResult.id)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
