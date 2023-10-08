import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getC, getJ } from '@src/utils';
import { DataSource, In, Repository } from 'typeorm';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { RoleResourcesDto } from './dto/role.resources.dto';
import { RoleResourcesEntity } from './entities/role.resources.entity';

@Injectable()
export class RoleResourcesService {
  constructor(
    @InjectRepository(RoleResourcesEntity)
    private readonly roleResourcesRepository: Repository<RoleResourcesEntity>,
    @InjectRepository(ResourcesEntity)
    private readonly resourcesRepository: Repository<ResourcesEntity>,
    private dataSource: DataSource
  ) {}
  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:14:23
   * @LastEditors: 水痕
   * @Description: 给角色分配资源
   * @param {RoleResourcesDto} req
   * @return {*}
   */
  async dispatchResourcesApi(req: RoleResourcesDto): Promise<string> {
    const { roleId } = req;
    // 处理如果没传递的时候直接清空
    if (!req.resourceList.length) {
      await this.roleResourcesRepository.delete({ roleId });
      return '分配资源成功';
    }
    // 根据当前角色查询之前的资源
    const roleResourcesEntity: Pick<RoleResourcesEntity, 'resourcesId'>[] =
      await this.roleResourcesRepository.find({
        where: { roleId },
        select: ['resourcesId'],
      });
    if (roleResourcesEntity.length) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction(); // 开启事物
      try {
        const oldResourceIdList = roleResourcesEntity.map(
          (item: Pick<RoleResourcesEntity, 'resourcesId'>) => item.resourcesId
        );
        // 1.利用交集处理要保留下来的
        const roleResourceList = getJ(oldResourceIdList, req.resourceList);
        // 2.计算需要删除的
        const roleResourceDeleteList = getC(roleResourceList, oldResourceIdList);
        if (roleResourceDeleteList.length) {
          const roleResourcesEntity1 = await this.roleResourcesRepository.find({
            where: {
              roleId: req.roleId,
              resourcesId: In(roleResourceDeleteList),
            },
            select: ['id'],
          });
          await queryRunner.manager.delete<RoleResourcesEntity>(
            RoleResourcesEntity,
            roleResourcesEntity1.map((item) => item.id)
          );
        }
        // 3.计算需要创建的
        const createRoleResourceList = getC(roleResourceList, req.resourceList);
        if (createRoleResourceList.length) {
          const createRoleResourcesData = createRoleResourceList.map((item) => {
            return {
              resourcesId: item,
              roleId: req.roleId,
            };
          });
          // 创建
          const data = queryRunner.manager.create<RoleResourcesEntity>(
            RoleResourcesEntity,
            createRoleResourcesData
          );
          await queryRunner.manager.save<RoleResourcesEntity>(data);
        }
        await queryRunner.commitTransaction(); // 提交事务
        return '分配资源成功';
      } catch (err) {
        await queryRunner.rollbackTransaction(); // 回滚操作
        throw new HttpException('分配资源失败', HttpStatus.OK);
      } finally {
        // 最后你需要释放一个手动实例化的queryRunner
        await queryRunner.release();
      }
    } else {
      // 第一次添加就可以
      const data = req.resourceList.map((item: number) => {
        return {
          roleId: req.roleId,
          resourcesId: item,
        };
      });
      const data1 = this.roleResourcesRepository.create(data);
      await this.roleResourcesRepository.save(data1);
      return '分配资源成功';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2023-10-08 08:14:57
   * @LastEditors: 水痕
   * @Description: 根据角色获取授权的资源
   * @param {number} roleId
   * @return {*}
   */
  async getResourceByRoleIdApi(roleId: number): Promise<ResourcesEntity[]> {
    const roleResourcesEntity: Pick<RoleResourcesEntity, 'resourcesId'>[] =
      await this.roleResourcesRepository.find({
        where: { roleId },
        select: ['resourcesId'],
      });
    const resourceIdList: number[] = roleResourcesEntity.map((item) => item.resourcesId);
    return await this.resourcesRepository.find({ where: { id: In(resourceIdList) } });
  }
}
