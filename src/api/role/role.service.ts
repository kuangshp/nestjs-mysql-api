import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOperator, ILike, In, Repository, SelectQueryBuilder } from 'typeorm';
import { ICurrentUserType } from '@src/decorators';
import { RoleDto } from './dto/role.dto';
import { PageEnum, StatusEnum } from '@src/enums';
import { RolePageVo, RoleVo } from './vo/role.vo';
import { QueryRoleDto } from './dto/role.query';
import { mapToObj } from '@src/utils';
import { AccountEntity } from '../account/entities/account.entity';
import { TenantEntity } from '../tenant/entities/tenant.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 21:22:44
   * @LastEditors: 水痕
   * @Description: 创建角色
   * @param {RoleDto} req
   * @param {ICurrentUserType} currentInfo
   * @return {*}
   */
  async createRoleApi(req: RoleDto, currentInfo: ICurrentUserType): Promise<string> {
    const { id, tenantId } = currentInfo;
    // 1.判断当前账号下角色是否存在
    const roleEntity: Pick<RoleEntity, 'id'> | null = await this.roleRepository.findOne({
      where: { name: req.name, accountId: id },
      select: ['id'],
    });
    if (roleEntity?.id) {
      throw new HttpException(`[${req.name}]可能已经存在`, HttpStatus.OK);
    }
    const roleData = this.roleRepository.create({
      name: req.name,
      tenantId,
      accountId: id,
      sort: req.sort,
      description: req.description,
    });
    await this.roleRepository.save(roleData);
    return '创建成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 21:35:28
   * @LastEditors: 水痕
   * @Description: 根据id删除角色
   * @param {number} id
   * @return {*}
   */
  async deleteRoleByIdApi(id: number): Promise<string> {
    const { affected } = await this.roleRepository.softDelete(id);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 21:36:25
   * @LastEditors: 水痕
   * @Description: 根据id修改角色状态
   * @param {number} id
   * @return {*}
   */
  async modifyRoleStatusByIdApi(id: number): Promise<string> {
    const roleEntity: Pick<RoleEntity, 'status'> | null = await this.roleRepository.findOne({
      where: { id },
      select: ['status'],
    });
    if (!roleEntity) {
      throw new HttpException('传递的id错误', HttpStatus.OK);
    }
    const { affected } = await this.roleRepository.update(id, {
      status: roleEntity?.status == StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN,
    });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 21:37:57
   * @LastEditors: 水痕
   * @Description: 根据id修改角色
   * @param {number} id
   * @param {RoleDto} req
   * @return {*}
   */
  async modifyRoleByIdApi(id: number, req: RoleDto): Promise<string> {
    // 判断名字是否重复
    const roleEntity: Pick<RoleEntity, 'id'> | null = await this.roleRepository.findOne({
      where: { name: req.name },
      select: ['id'],
    });
    if (roleEntity && roleEntity.id != id) {
      throw new HttpException(`[${req.name}]可能重复`, HttpStatus.OK);
    }
    const { affected } = await this.roleRepository.update(id, req);
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 21:42:27
   * @LastEditors: 水痕
   * @Description: 分页获取角色
   * @param {QueryRoleDto} queryOption
   * @return {*}
   */
  async getRolePageApi(
    queryOption: QueryRoleDto,
    currentInfo: ICurrentUserType
  ): Promise<RolePageVo> {
    const {
      name,
      status,
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
    } = queryOption;
    const { id } = currentInfo;
    const query = new Map<string, FindOperator<string>>();
    if (name) {
      query.set('name', ILike(`%${name}%`));
    }
    if (status >= 0) {
      query.set('status', Equal(status + ''));
    }
    query.set('accountId', Equal(id + ''));
    // if (accountType == AccountTypeEnum.SUPER_ACCOUNT) {
    //   console.log('超管');
    // } else if (accountType == AccountTypeEnum.PRIMARY_ACCOUNT) {
    //   query.set('tenantId', Equal(tenantId + ''));
    // } else if (accountType == AccountTypeEnum.NORMAL_ACCOUNT) {
    //   query.set('accountId', Equal(id + ''));
    // }
    const queryBuilder = this.queryRoleBuilder;
    const data = await queryBuilder
      .where(mapToObj(query))
      .orderBy({ id: 'DESC' })
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .printSql()
      .getRawMany();
    const total: number = await this.roleRepository
      .createQueryBuilder('role')
      .where(mapToObj(query))
      .getCount();
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 21:46:58
   * @LastEditors: 水痕
   * @Description: 根据id获取角色
   * @param {number} id
   * @return {*}
   */
  async getRoleByIdApi(id: number): Promise<RoleVo | undefined> {
    return await this.queryRoleBuilder.where('role.id = :id', { id }).getRawOne();
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-10 20:39:04
   * @LastEditors: 水痕
   * @Description: 根据角色id批量删除
   * @param {number} idList
   * @return {*}
   */
  async batchDeleteRoleByIdListApi(idList: number[]): Promise<string> {
    const { affected } = await this.roleRepository.softDelete(idList);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-10 20:41:14
   * @LastEditors: 水痕
   * @Description: 根据id批量修改状态
   * @param {number} idList
   * @return {*}
   */
  async batchModifyRoleStatusByIdApi(idList: number[]): Promise<string> {
    const roleEntityList: Pick<RoleEntity, 'status'>[] = await this.roleRepository.find({
      where: { id: In(idList) },
      select: ['status'],
    });
    const statusList = roleEntityList.map((item) => item.status);
    if ([...new Set(statusList)].length > 1) {
      throw new HttpException('当前传递的数据状态不统一,不能批量操作', HttpStatus.OK);
    }
    const { affected } = await this.roleRepository.update(idList, {
      status: statusList[0] == StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN,
    });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  get queryRoleBuilder(): SelectQueryBuilder<RoleEntity> {
    return this.roleRepository
      .createQueryBuilder('role')
      .select('role.id', 'id')
      .addSelect('role.name', 'name')
      .addSelect('role.accountId', 'accountId')
      .addSelect('role.tenantId', 'tenantId')
      .addSelect('role.status', 'status')
      .addSelect('role.sort', 'sort')
      .addSelect('role.description', 'description')
      .addSelect('role.createdAt', 'createdAt')
      .addSelect('role.updatedAt', 'updatedAt')
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('account.id', 'accountId')
            .addSelect('account.username', 'accountUsername')
            .from(AccountEntity, 'account'),
        'account',
        'role.accountId=account.accountId'
      )
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('tenant.id', 'tenantId')
            .addSelect('tenant.name', 'tenantName')
            .from(TenantEntity, 'tenant'),
        'tenant',
        'role.tenantId=tenant.tenantId'
      );
  }
}
