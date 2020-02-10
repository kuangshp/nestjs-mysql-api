import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { UserRoleEntity } from '@src/entities/user_role.entity';
import { Repository, getManager, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '@src/entities/role.entity';

@Injectable()
export class UserRoleService extends BaseService {
  constructor (
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {
    super(userRoleRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-05 12:15:39
   * @LastEditors: 水痕
   * @Description: 获取角色树
   * @param {type}
   * @return:
   */
  async roleTree(userId: number): Promise<any> {
    // 获取已经设置的角色
    const alreadyRoleList = await this.userRoleRepository.find({ where: { userId } });
    // 提取全部的id
    const alreadyRoleIdList = alreadyRoleList.map(item => item.roleId);
    // 获取全部的角色
    const result = await this.roleRepository.find();
    return result.map((item: any) => {
      return {
        id: item.id,
        key: item.id.toString(),
        title: item.title,
        direction: alreadyRoleIdList.includes(item.id) ? 'right' : 'left',
      }
    })
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-05 11:51:46
   * @LastEditors: 水痕
   * @Description: 给用户分配角色
   * @param {type} 
   * @return: 
   */
  async assignRole(data: any): Promise<any> {
    const { userId, roleList } = data;
    /**
     * 1.先将表中userId的删除
     * 2.重新插入数据
     */
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        await entityManager.delete(UserRoleEntity, { userId: Number(userId) })
        for (let item of roleList) {
          await entityManager.save(UserRoleEntity, { userId, roleId: Number(item) })
        }
      }).then(async () => {
        return '成功';
      }).catch((e) => {
        Logger.error('用户分配角色错误', e);
        throw new HttpException('用户分配角色错误', HttpStatus.OK);
      });
  }
}