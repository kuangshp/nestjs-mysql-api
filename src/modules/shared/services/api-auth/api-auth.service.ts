import { Injectable, HttpException, HttpCode, HttpStatus } from '@nestjs/common';
import { ICurrentUserType } from '@src/decorators/current.user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { AccountRoleEntity } from '@src/modules/admin/system/account/entities/account.role.entity';
import { AccessEntity } from '@src/modules/admin/system/access/entities/access.entity';
import { RoleAccessEntity } from '@src/modules/admin/system/role/entities/role.access.entity';

@Injectable()
export class ApiAuthService {
  constructor(
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>,
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) {}
  /**
   * @Author: 水痕
   * @Date: 2021-04-07 14:12:12
   * @LastEditors: 水痕
   * @Description: 拦截api
   * @param {ICurrentUserType} user
   * @param {boolean} classAuth
   * @param {boolean} methodAuth
   * @param {string} method
   * @param {string} url
   * @return {*}
   */
  public async apiAuth(
    user: ICurrentUserType,
    classAuth: boolean,
    methodAuth: boolean,
    method: string,
    url: string,
  ): Promise<boolean> {
    const { isSuper, id } = user;
    // 1.如果是超级管理员就直接返回true
    if (isSuper) {
      return true;
    } else {
      // 2.根据当前账号id获取当前账号拥有的角色id
      const authRoleList: AccountRoleEntity[] = await this.accountRoleRepository.find({
        where: { accountId: id },
        select: ['roleId'],
      });
      const authRoleIdList: number[] = authRoleList.map((item: AccountRoleEntity) => item.roleId);
      console.log(authRoleList, '授权的角色列表');
      // 3.根据角色ID列表获取当前账号拥有的资源id
      const authAccessList = await getConnection()
        .createQueryBuilder(RoleAccessEntity, 'role_access')
        .select(['role_access.accessId', 'role_access.type'])
        .where('role_access.roleId in (:...roleId)', { roleId: authRoleIdList })
        .getMany();
      console.log(authAccessList, '授权的资源列表'); // [ RoleAccessEntity { accessId: 5, type: 3 } ]
      console.log(method, url, '===>');
      if (classAuth) {
        // 如果是类API守卫的时候
        return false;
      } else if (methodAuth) {
        // 如果是方法守卫
        const formatUrl = this.formatUrl(method, url);
        // 4.根据请求方式和路径去查询数据
        const accessResult: AccessEntity | undefined = await this.accessRepository.findOne({
          where: { method, url: formatUrl },
          select: ['id', 'type'],
        });
        const isExist = authAccessList.find(
          (item: RoleAccessEntity) =>
            item.accessId === accessResult?.id && Number(item.type) === Number(accessResult?.type),
        );
        if (isExist) {
          return true;
        } else {
          throw new HttpException(`当前账号没操作:${method}-${url}的权限`, HttpStatus.OK);
        }
      } else {
        throw new HttpException(`当前账号没操作:${method}-${url}的权限`, HttpStatus.OK);
      }
    }
  }

  private formatUrl(method: string, url: string): string {
    switch (method) {
      case 'GET':
        // 去除问号后面的
        return url.substring(0, url.indexOf('?'));
      case 'DELETE':
      case 'PATH':
      case 'PUT':
        // url最后一个改为*通配符
        return url.replace(/(.*?\/)\d+$/, '$1*');
      default:
        return url;
    }
  }
}
