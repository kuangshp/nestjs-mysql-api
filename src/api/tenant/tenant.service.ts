import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TenantEntity } from './entities/tenant.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Equal, FindOperator, ILike, In, Repository, SelectQueryBuilder } from 'typeorm';
import { TenantDto } from './dto/tenant.dto';
import { QueryTenantDto } from './dto/tenant.query';
import { PageEnum, StatusEnum } from '@src/enums';
import { TenantPageVo, TenantVo } from './vo/tenant.vo';
import { AreaEntity } from '../area/entities/area.entity';
import { mapToObj } from '@src/utils';
import { AccountEntity } from '../account/entities/account.entity';
import { ICurrentUserType } from '@src/decorators';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 10:45:37
   * @LastEditors: 水痕
   * @Description: 创建商户
   * @param {TenantEntity} tenantDto
   * @return {*}
   */
  async createTenantApi(req: TenantDto): Promise<string> {
    // 1.判断商户名称是否已经存在
    const tenantEntity: Pick<TenantEntity, 'id'> | null = await this.tenantRepository.findOne({
      where: { name: req.name },
      select: ['id'],
    });
    if (tenantEntity?.id) {
      throw new HttpException(`${req.name}已经存在`, HttpStatus.OK);
    }
    const data = this.tenantRepository.create(req);
    await this.tenantRepository.save(data);
    return '创建成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-09 20:58:51
   * @LastEditors: 水痕
   * @Description: 根据id列表批量删除
   * @param {number} idList
   * @return {*}
   */
  async batchDeleteTenantByIdListApi(
    idList: number[],
    currentUser: ICurrentUserType
  ): Promise<string> {
    console.log(idList, '获取到的数据', currentUser);
    const { tenantId } = currentUser;
    console.log(tenantId, idList.includes(tenantId), '???');
    if (idList.includes(tenantId)) {
      throw new HttpException('自己不能删除自己', HttpStatus.OK);
    }
    const { affected } = await this.tenantRepository.softDelete(idList);
    if (affected) {
      return '删除成功';
    } else {
      return '删除成功';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 10:50:10
   * @LastEditors: 水痕
   * @Description: 根据id删除商户
   * @param {number} id
   * @return {*}
   */
  async deleteTenantByIdApi(id: number, currentUser: ICurrentUserType): Promise<string> {
    const { tenantId } = currentUser;
    if (tenantId == id) {
      throw new HttpException('自己不能删除自己', HttpStatus.OK);
    }
    const { affected } = await this.tenantRepository.softDelete(id);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-09 22:06:30
   * @LastEditors: 水痕
   * @Description: 批量修改状态
   * @return {*}
   */
  async batchModifyTenantStatusByIdApi(
    idList: number[],
    currentUser: ICurrentUserType
  ): Promise<string> {
    const { tenantId } = currentUser;
    if (idList.includes(tenantId)) {
      throw new HttpException('自己不能修改自己', HttpStatus.OK);
    }
    const tenantEntityList: Pick<TenantEntity, 'status'>[] = await this.tenantRepository.find({
      where: { id: In(idList) },
      select: ['status'],
    });
    if ([...new Set(tenantEntityList.map((item) => item.status))].length > 1) {
      throw new HttpException('当前状态不统一,不能批量修改', HttpStatus.OK);
    }
    const { affected } = await this.tenantRepository.update(idList, {
      status:
        tenantEntityList[0]?.status == StatusEnum.FORBIDDEN
          ? StatusEnum.NORMAL
          : StatusEnum.FORBIDDEN,
    });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-07 20:51:30
   * @LastEditors: 水痕
   * @Description: 根据id修改状态
   * @param {number} id
   * @return {*}
   */
  async modifyTenantStatusByIdApi(id: number, currentUser: ICurrentUserType): Promise<string> {
    const { tenantId } = currentUser;
    if (tenantId == id) {
      throw new HttpException('自己不能修改自己', HttpStatus.OK);
    }
    const tenantEntity: Pick<TenantEntity, 'status'> | null = await this.tenantRepository.findOne({
      where: { id },
      select: ['status'],
    });
    if (!tenantEntity) {
      throw new HttpException('传递的id错误', HttpStatus.OK);
    }
    const { affected } = await this.tenantRepository.update(id, {
      status:
        tenantEntity?.status == StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN,
    });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 10:50:36
   * @LastEditors: 水痕
   * @Description: 根据id修改商户数据
   * @param {number} id
   * @param {TenantEntity} tenantDto
   * @return {*}
   */
  async modifyTenantByIdApi(id: number, req: TenantDto): Promise<string> {
    const tenantEntity: Pick<TenantEntity, 'id'> | null = await this.tenantRepository.findOne({
      where: { name: req.name },
      select: ['id'],
    });
    if (tenantEntity?.id && tenantEntity?.id != id) {
      throw new HttpException(`${req.name}已经存在`, HttpStatus.OK);
    }
    const { affected } = await this.tenantRepository.update(id, req);
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 10:53:15
   * @LastEditors: 水痕
   * @Description:
   * @return {*}
   */
  async getTenantPageApi(queryOption: QueryTenantDto): Promise<TenantPageVo> {
    const {
      name,
      status,
      mobile,
      username,
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
    } = queryOption;
    const query = new Map<string, FindOperator<string>>();
    if (name) {
      query.set('name', ILike(`%${name}%`));
    }
    if (mobile) {
      query.set('mobile', Equal(mobile));
    }
    if (username) {
      query.set('username', ILike(`%${username}%`));
    }
    if (status >= 0) {
      query.set('status', Equal(status + ''));
    }
    const queryBuilder = this.queryTenantBuilder;
    const data = await queryBuilder
      .where(mapToObj(query))
      .orderBy({ id: 'DESC' })
      .offset((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .printSql()
      .getRawMany();
    const total: number = await this.tenantRepository
      .createQueryBuilder('tenant')
      .where(mapToObj(query))
      .getCount();
    // 根据商户id去查询account表数据
    const tenantIdList = data.map((item) => item.id);
    const accountTotalList = await this.accountRepository
      .createQueryBuilder('account')
      .select('account.tenantId', 'tenantId')
      .addSelect('count(*)', 'total')
      .where({ tenantId: In(tenantIdList) })
      .groupBy('account.tenantId')
      .getRawMany();
    // 将accountTotalList -> map[tenantId] = total
    const accountTotalMap = new Map();
    for (const item of accountTotalList) {
      accountTotalMap.set(item.tenantId, item.total);
    }
    const resultData: TenantVo[] = [];
    for (const item of data) {
      resultData.push({
        ...item,
        accountTotal: +accountTotalMap.get(item.id),
      });
    }
    return {
      data: resultData,
      total,
      pageNumber,
      pageSize,
    };
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 11:30:21
   * @LastEditors: 水痕
   * @Description: 根据id获取单条数据
   * @param {number} id
   * @return {*}
   */
  async getTenantByIdApi(id: number): Promise<TenantVo | undefined> {
    const queryBuilder = this.queryTenantBuilder;
    return await queryBuilder.where('tenant.id = :id', { id }).getRawOne();
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-07 11:05:41
   * @LastEditors: 水痕
   * @Description: 公共查询方法
   * @return {*}
   */
  get queryTenantBuilder(): SelectQueryBuilder<TenantEntity> {
    return this.tenantRepository
      .createQueryBuilder('tenant')
      .select('tenant.id', 'id')
      .addSelect('tenant.name', 'name')
      .addSelect('tenant.username', 'username')
      .addSelect('tenant.mobile', 'mobile')
      .addSelect('tenant.balance', 'balance')
      .addSelect('tenant.expireTime', 'expireTime')
      .addSelect('tenant.status', 'status')
      .addSelect('tenant.provinceId', 'provinceId')
      .addSelect('tenant.cityId', 'cityId')
      .addSelect('tenant.areaId', 'areaId')
      .addSelect('tenant.address', 'address')
      .addSelect('tenant.sort', 'sort')
      .addSelect('tenant.description', 'description')
      .addSelect('tenant.createdAt', 'createdAt')
      .addSelect('tenant.updatedAt', 'updatedAt')
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('area.id', 'provinceId')
            .addSelect('area.name', 'provinceName')
            .from(AreaEntity, 'area'),
        'area',
        'tenant.provinceId=area.provinceId'
      )
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('area1.id', 'cityId')
            .addSelect('area1.name', 'cityName')
            .from(AreaEntity, 'area1'),
        'area1',
        'tenant.cityId=area1.cityId'
      )
      .leftJoinAndMapOne(
        'xx',
        (qb) =>
          qb
            .select('area2.id', 'areaId')
            .addSelect('area2.name', 'areaName')
            .from(AreaEntity, 'area2'),
        'area2',
        'tenant.areaId=area2.areaId'
      );
  }
}
