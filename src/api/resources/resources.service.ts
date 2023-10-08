import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum, StatusEnum } from '@src/enums';
import { mapToObj } from '@src/utils';
import { Equal, FindOperator, ILike, In, Repository } from 'typeorm';
import { ResourcesDto } from './dto/resources.dto';
import { QueryResourcesDto } from './dto/resources.query.dto';
import { ResourcesEntity } from './entities/resources.entity';
import { ResourcesListVo, ResourcesVo, SimplenessResourceVo } from './vo/resources.vo';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(ResourcesEntity)
    private readonly resourcesRepository: Repository<ResourcesEntity>
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
      type,
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
    if ([0, 1, 2].includes(type)) {
      queryMap.set('type', Equal(type + ''));
    }

    if (parentId) {
      queryMap.set('parentId', Equal(parentId + ''));
    }
    const [data, total] = await this.resourcesRepository
      .createQueryBuilder()
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy({ id: 'DESC' })
      .printSql()
      .where(mapToObj(queryMap))
      .getManyAndCount();
    return {
      data,
      total,
      pageNumber: +pageNumber,
      pageSize: +pageSize,
    };
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:07:30
   * @LastEditors: 水痕
   * @Description: 根据资源目录
   * @return {*}
   */
  async getResourceCatalogApi(): Promise<SimplenessResourceVo[]> {
    return await this.resourcesRepository.find({
      where: { resourcesType: 0 },
      select: ['id', 'title'],
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:07:50
   * @LastEditors: 水痕
   * @Description: 获取一级和二级下的菜单
   * @return {*}
   */
  async getMenusListApi(): Promise<ResourcesVo[]> {
    return await this.resourcesRepository.find({ where: { type: In([0, 1]) } });
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
