import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectionsPermissionService } from '@src/modules/common/collections-permission/services/collections.permission.service';
import { Repository } from 'typeorm';
import { ResourceEntity } from '../entities/resource.entity';

@Injectable()
export class ResourceService {
  /** 存储收集起来的数据 */
  private resourceList: Omit<ResourceEntity, 'id' | 'createdAt' | 'updatedAt'>[] | undefined = [];
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    private readonly collectionsPermissionService: CollectionsPermissionService,
  ) {}

  onModuleInit() {
    this.initPermission();
  }

  private async initPermission() {
    this.resourceList = await this.collectionsPermissionService.allPermissionList();
    this.createOrUpdateResource();
    this.differenceResource();
  }
  /**
   * @Author: 水痕
   * @Date: 2021-09-27 15:27:37
   * @LastEditors: 水痕
   * @Description: 创建或更新资源表
   * @param {*}
   * @return {*}
   */
  private async createOrUpdateResource(): Promise<void> {
    if (!this.resourceList) return;
    for (const item of this.resourceList) {
      const { moduleName, methodName, method, url } = item;
      // 1.先判断是否存在不存在的时候就要插入到数据库中，存在就修改下(防止改了名字)
      const resourceInfo: Pick<ResourceEntity, 'id'> | undefined =
        await this.resourceRepository.findOne({
          where: { method, url },
          select: ['id'],
        });
      if (!resourceInfo?.id) {
        const result = this.resourceRepository.create({
          moduleName,
          methodName,
          method,
          url,
        });
        await this.resourceRepository.save(result);
      } else {
        await this.resourceRepository.update({ id: resourceInfo.id }, { moduleName, methodName });
      }
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-09-27 15:25:31
   * @LastEditors: 水痕
   * @Description: 删除数据库多余的资源
   * @param {*}
   * @return {*}
   */
  private async differenceResource(): Promise<void> {
    // 2.比较当前的比数据库的少了，要删除
    type DbResource = Omit<ResourceEntity, 'createdAt' | 'updatedAt'>;
    const dbResourceList: DbResource[] = await this.resourceRepository.find({
      select: ['id', 'moduleName', 'methodName', 'method', 'url'],
    });
    const differenceList: DbResource[] = dbResourceList.filter((item: DbResource) => {
      if (!this.resourceList) return;
      const isExist = this.resourceList.find(
        (it) =>
          item.moduleName == it.moduleName &&
          item.methodName == it.methodName &&
          item.method == it.method &&
          item.url == it.url,
      );
      return !isExist;
    });
    // 数据库删除
    if (differenceList.length) {
      const differenceIdList = differenceList.map((item: DbResource) => item.id);
      await this.resourceRepository.delete(differenceIdList);
    }
  }
}
