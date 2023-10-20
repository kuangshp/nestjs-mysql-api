import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICurrentUserType } from '@src/decorators';
import { PageEnum, StatusEnum } from '@src/enums';
import { mapToObj } from '@src/utils';
import { Equal, FindOperator, ILike, In, Repository } from 'typeorm';
import { MenusRepository } from '../menus/menus.repository';
import { ResourcesDto } from './dto/resources.dto';
import { QueryResourcesDto } from './dto/resources.query.dto';
import { ResourcesEntity } from './entities/resources.entity';
import { ResourcesListVo, ResourcesVo, SimplenessResourceVo } from './vo/resources.vo';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourcesEntity)
    private readonly resourcesRepository: Repository<ResourcesEntity>,
    private readonly menusRepository: MenusRepository
  ) {}

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:07:15
   * @LastEditors: 水痕
   * @Description: 创建资源
   * @param {ResourcesDto} resourcesDto
   * @return {*}
   */
  async createResourceApi(resourcesDto: ResourcesDto): Promise<string> {
    const data = this.resourcesRepository.create(resourcesDto);
    await this.resourcesRepository.save(data);
    return '创建成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:07:07
   * @LastEditors: 水痕
   * @Description: 根据id删除数据
   * @param {number} id
   * @return {*}
   */
  async deleteResourceByIdApi(id: number): Promise<string> {
    const { affected } = await this.resourcesRepository.delete(id);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:06:58
   * @LastEditors: 水痕
   * @Description: 根据id修改资源
   * @param {number} id
   * @param {ResourcesDto} resourcesDto
   * @return {*}
   */
  async modifyResourceByIdApi(id: number, resourcesDto: ResourcesDto): Promise<string> {
    const { affected } = await this.resourcesRepository.update(id, resourcesDto);
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:06:42
   * @LastEditors: 水痕
   * @Description: 分页获取一级资源
   * @param {QueryResourcesDto} queryResourcesDto
   * @return {*}
   */
  async getResourcePageApi(queryResourcesDto: QueryResourcesDto): Promise<ResourcesListVo> {
    const {
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      title,
      resourcesType,
      parentId,
      status,
    } = queryResourcesDto;
    const queryMap = new Map<string, FindOperator<string>>();
    if (title) {
      queryMap.set('title', ILike(`%${title}%`));
    }
    if ([(StatusEnum.NORMAL, StatusEnum.FORBIDDEN)].includes(status)) {
      queryMap.set('status', Equal(status + ''));
    }
    if ([0, 1, 2].includes(resourcesType)) {
      queryMap.set('resourcesType', Equal(resourcesType + ''));
    }

    if (parentId) {
      queryMap.set('parentId', Equal(parentId + ''));
    } else {
      queryMap.set('parentId', Equal('-1'));
    }
    const [data, total] = await this.resourcesRepository
      .createQueryBuilder()
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy({ sort: 'ASC', id: 'DESC' })
      .printSql()
      .where(mapToObj(queryMap))
      .getManyAndCount();
    // 抽取全部的id
    const resourcesIdList = data.map((item) => item.id);
    const resourcesEntityList: Pick<ResourcesEntity, 'parentId'>[] =
      await this.resourcesRepository.find({
        where: { parentId: In(resourcesIdList) },
        select: ['parentId'],
      });
    // 组成map[parentId] = true
    const resourcesMap = new Map<number, boolean>();
    for (const item of resourcesEntityList) {
      resourcesMap.set(item.parentId, true);
    }
    const result: ResourcesVo[] = [];
    for (const item of data) {
      result.push({
        ...item,
        hasChildren: resourcesMap.get(item.id),
      });
    }
    return {
      data: result,
      total,
      pageNumber: +pageNumber,
      pageSize: +pageSize,
    };
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-11 12:05:30
   * @LastEditors: 水痕
   * @Description: 根据资源模块
   * @param {number} catalogType 0的时候只查询出模块,1的时候查询出模块和菜单2,的时候查询模块、菜单、按钮
   * @return {*}
   */
  async getResourceCatalogApi(catalogType: number): Promise<SimplenessResourceVo[]> {
    console.log(catalogType, '111---->');
    const queryMap = new Map<string, FindOperator<string>>();
    if (catalogType == 2) {
      queryMap.set('resourcesType', In([0, 1]));
    } else {
      queryMap.set('resourcesType', In([0]));
    }
    return await this.resourcesRepository.find({
      where: mapToObj(queryMap),
      select: ['id', 'title', 'parentId'],
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:07:50
   * @LastEditors: 水痕
   * @Description: type=0表示菜单,1表示按钮
   * @return {*}
   */
  async getResourcesListApi(
    type: number,
    currentInfo: ICurrentUserType
  ): Promise<SimplenessResourceVo[]> {
    console.log(currentInfo, '当前用户');
    let resourcesType: any = [];
    if (type == 0) {
      resourcesType = [0, 1];
    } else if (type == 1) {
      resourcesType = [0, 1, 2];
    }
    const resourcesIdList = await this.menusRepository.getResourcesIdList(currentInfo, type);
    return await this.resourcesRepository.find({
      where: {
        id: In(resourcesIdList),
        resourcesType: In(resourcesType),
        status: StatusEnum.NORMAL,
      },
      select: ['id', 'title', 'parentId', 'resourcesType'],
    });
  }
  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:07:59
   * @LastEditors: 水痕
   * @Description: 根据目录id查询下面全部的菜单
   * @param {number} id
   * @return {*}
   */
  async getMenusByCatalogIdApi(id: number): Promise<SimplenessResourceVo[]> {
    return await this.resourcesRepository.find({
      where: { parentId: id, resourcesType: 1 },
      select: ['id', 'title'],
    });
  }
}
