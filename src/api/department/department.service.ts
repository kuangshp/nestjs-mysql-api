import { HttpException, Injectable } from '@nestjs/common';
import { DepartmentEntity } from './entities/department.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOperator, ILike, In, Repository, SelectQueryBuilder } from 'typeorm';
import { DepartmentDto } from './dto/department.dto';
import { ICurrentUserType } from '@src/decorators';
import { HttpStatusCode } from 'axios';
import { DepartmentPageVo, DepartmentVo, SimplenessDepartmentVo } from './vo/department.vo';
import { TenantEntity } from '../tenant/entities/tenant.entity';
import { QueryDepartmentDto } from './dto/department.query';
import { PageEnum, StatusEnum } from '@src/enums';
import { mapToObj } from '@src/utils';
import { AccountTypeEnum } from '@src/enums/account.type.enum';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-18 14:43:43
   * @LastEditors: 水痕
   * @Description: 创建部门
   * @param {DepartmentDto} req
   * @param {ICurrentUserType} currentUser
   * @return {*}
   */
  async createDepartmentApi(req: DepartmentDto, currentUser: ICurrentUserType): Promise<string> {
    // 1.判断部门存在吗
    const { tenantId } = currentUser;
    const departmentEntity: Pick<DepartmentEntity, 'id'> | null =
      await this.departmentRepository.findOne({
        where: { tenantId, title: req.title },
        select: ['id'],
      });
    if (departmentEntity?.id) {
      throw new HttpException(`${req.title}已经存在`, HttpStatusCode.Ok);
    }
    const data = this.departmentRepository.create({ ...req, tenantId });
    await this.departmentRepository.save(data);
    return '创建成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-18 14:48:25
   * @LastEditors: 水痕
   * @Description: 根据id删除部门
   * @param {number} id
   * @return {*}
   */
  async deleteDepartmentByIdApi(id: number): Promise<string> {
    // 如果有子部门不能直接被删除
    const departmentEntity: Pick<DepartmentEntity, 'id'> | null =
      await this.departmentRepository.findOne({
        where: { parentId: id },
        select: ['id'],
      });
    if (departmentEntity?.id) {
      throw new HttpException('当前部门有子部门,不能直接删除', HttpStatusCode.Ok);
    }
    const { affected } = await this.departmentRepository.softDelete(id);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-18 15:38:16
   * @LastEditors: 水痕
   * @Description: 根据id修改部门状态
   * @param {number} id
   * @return {*}
   */
  async modifyDepartmentStatusByIdApi(id: number): Promise<string> {
    const departmentEntity: Pick<DepartmentEntity, 'status'> | null =
      await this.departmentRepository.findOne({
        where: { id },
        select: ['status'],
      });
    if (!departmentEntity) {
      throw new HttpException('你传递的部门id错误', HttpStatusCode.Ok);
    }
    const status =
      departmentEntity.status == StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN;
    const { affected } = await this.departmentRepository.update(id, { status });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-18 15:04:57
   * @LastEditors: 水痕
   * @Description:
   * @return {*}
   */
  async modifyDepartmentByIdApi(
    id: number,
    req: DepartmentDto,
    currentUser: ICurrentUserType
  ): Promise<string> {
    // 查询当前商户下之前是有该部门
    const { tenantId } = currentUser;
    const departmentEntity: Pick<DepartmentEntity, 'id'> | null =
      await this.departmentRepository.findOne({
        where: { tenantId, title: req.title },
        select: ['id'],
      });
    if (departmentEntity?.id && departmentEntity?.id != id) {
      throw new HttpException(`${req.title}可能存在`, HttpStatusCode.Ok);
    }
    const { affected } = await this.departmentRepository.update(id, req);
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-18 15:16:27
   * @LastEditors: 水痕
   * @Description: 分页获取部门
   * @param {QueryDepartmentDto} queryOption
   * @param {ICurrentUserType} currentUser
   * @return {*}
   */
  async getDepartmentPageApi(
    queryOption: QueryDepartmentDto,
    currentUser: ICurrentUserType
  ): Promise<DepartmentPageVo> {
    const {
      status,
      title,
      tenantId: queryTenantId,
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
    } = queryOption;
    const query = new Map<string, FindOperator<string>>();
    if (title) {
      query.set('title', ILike(`%${title}%`));
    }
    if ([StatusEnum.NORMAL, StatusEnum.FORBIDDEN].includes(status)) {
      query.set('status', Equal(status + ''));
    }
    const { accountType, id, tenantId } = currentUser;
    /**
     * 1.如果是超管,查询到全部的账号
     * 2.如果不是超管,是主账号的时候查询下面全部的账号
     * 3.如果都不是,只能查询账号下的数据
     */
    if (queryTenantId) {
      query.set('tenantId', Equal(queryTenantId + ''));
    } else {
      if (accountType == AccountTypeEnum.SUPER_ACCOUNT) {
        console.log('超管不需要');
      } else if (accountType == AccountTypeEnum.PRIMARY_ACCOUNT) {
        query.set('tenantId', Equal(tenantId + ''));
      } else if (accountType == AccountTypeEnum.NORMAL_ACCOUNT) {
        query.set('parentId', Equal(id + ''));
      }
    }
    const total = await this.departmentRepository
      .createQueryBuilder('department')
      .where(mapToObj(query))
      .getCount();
    const queryBuilder = this.queryDepartmentBuilder;
    const data = await queryBuilder
      .where(mapToObj(query))
      .orderBy({ id: 'DESC' })
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .getRawMany();
    console.log(data, '????????????????');
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-18 20:27:28
   * @LastEditors: 水痕
   * @Description: 获取当前商户下的部门
   * @param {ICurrentUserType} currentUser
   * @return {*}
   */
  async getDepartmentListApi(currentUser: ICurrentUserType): Promise<SimplenessDepartmentVo[]> {
    const { id, tenantId, accountType } = currentUser;
    const query = new Map<string, FindOperator<string>>();
    query.set('tenantId', Equal(tenantId + ''));
    if (accountType != AccountTypeEnum.SUPER_ACCOUNT) {
      query.set('parentId', Equal(id + ''));
    }
    return await this.departmentRepository.find({
      where: mapToObj(query),
      select: ['id', 'title', 'parentId'],
    });
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-18 15:21:30
   * @LastEditors: 水痕
   * @Description: 根据部门id获取数据
   * @param {number} id
   * @return {*}
   */
  async getDepartmentByIdApi(id: number): Promise<DepartmentVo | undefined> {
    return await this.queryDepartmentBuilder.where('department.id = :id', { id }).getRawOne();
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-18 15:52:37
   * @LastEditors: 水痕
   * @Description: 批量删除部门
   * @param {number} idList
   * @return {*}
   */
  async batchDeleteDepartmentByIdListApi(idList: number[]): Promise<string> {
    const departmentEntityList: Pick<DepartmentEntity, 'parentId'>[] =
      await this.departmentRepository.find({
        where: { parentId: In(idList) },
        select: ['parentId', 'id'],
      });
    if (departmentEntityList.length > 0) {
      throw new HttpException('当前部门有子部门,不能直接删除', HttpStatusCode.Ok);
    }
    const departmentEntityList1: Pick<DepartmentEntity, 'parentId'>[] =
      await this.departmentRepository.find({
        where: { id: In(idList) },
        select: ['parentId'],
      });
    if (departmentEntityList1.map((item) => item.parentId).includes(-1)) {
      throw new HttpException('当前部门有子部门,不能直接删除', HttpStatusCode.Ok);
    }
    const { affected } = await this.departmentRepository.softDelete({ id: In(idList) });
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-18 15:58:14
   * @LastEditors: 水痕
   * @Description:根据id列表修改状态
   * @param {number} idList
   * @return {*}
   */
  async batchModifyDepartmentStatusByIdApi(idList: number[]): Promise<string> {
    const departmentEntityList: Pick<DepartmentEntity, 'status'>[] =
      await this.departmentRepository.find({ where: { id: In(idList) }, select: ['status'] });
    const statusList = departmentEntityList.map((item) => item.status);
    if ([...new Set(statusList)].length > 1) {
      throw new HttpException('当前部门多个状态,不能批量操作', HttpStatusCode.Ok);
    }
    const status = statusList[0] == StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN;
    const { affected } = await this.departmentRepository.update({ id: In(idList) }, { status });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-18 15:21:41
   * @LastEditors: 水痕
   * @Description: 内部使用
   * @return {*}
   */
  get queryDepartmentBuilder(): SelectQueryBuilder<DepartmentEntity> {
    return this.departmentRepository
      .createQueryBuilder('department')
      .select('department.id', 'id')
      .addSelect('department.title', 'title')
      .addSelect('department.name', 'name')
      .addSelect('department.mobile', 'mobile')
      .addSelect('department.email', 'email')
      .addSelect('department.tenantId', 'tenantId')
      .addSelect('department.parentId', 'parentId')
      .addSelect('department.sort', 'sort')
      .addSelect('department.status', 'status')
      .addSelect('department.createdAt', 'createdAt')
      .addSelect('department.updatedAt', 'updatedAt')
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('department1.id', 'parentId')
            .addSelect('department1.title', 'parentTitle')
            .from(DepartmentEntity, 'department1'),
        'department1',
        'department.parentId=department1.parentId'
      )
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('tenant.id', 'tenantId')
            .addSelect('tenant.name', 'tenantName')
            .from(TenantEntity, 'tenant'),
        'tenant',
        'department.tenantId=tenant.tenantId'
      );
  }
}
