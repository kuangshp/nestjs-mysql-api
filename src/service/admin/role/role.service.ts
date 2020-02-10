import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseService } from '../../base/base.service';
import { RoleEntity } from '@src/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { RoleAccessEntity } from '@src/entities/role_access.entity';
import { sqlParamsJoin, sqlWhere } from '@src/utils';

@Injectable()
export class RoleService extends BaseService {
  constructor (
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>
  ) {
    super(roleRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 15:59:09
   * @LastEditors: 水痕
   * @Description: 根据id删除角色
   * @param {type} 
   * @return: 
   */
  async deleteById(id: string): Promise<any> {
    let role: any;
    if (this.isUUID(id)) {
      role = await this.roleRepository.findOne({ where: { uuid: id } });
    } else if (this.isInt(id)) {
      role = await this.roleRepository.findOne({ where: { id: id } });
    }
    const roleId = role.id;
    if (!roleId) {
      throw new HttpException('删除失败,没有该角色', HttpStatus.OK);
    } else {
      const user = await this.userRepository.query(`select id from user where role_id=${roleId}`);
      if (user && user.length) {
        throw new HttpException('不能删除该角色,角色下有关联用户', HttpStatus.OK);
      } else {
        return this.roleRepository.delete({ id: roleId });
      }
    }

  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 20:36:52
   * @LastEditors: 水痕
   * @Description: 给角色分配资源
   * @param {type} 
   * @return: 
   */
  async assignAccess(data: any): Promise<any> {
    const { roleId, accessList, type } = data;
    /**
     * 1.先将表中roleId的删除
     * 2.重新插入数据
     */
    return getManager()
      .transaction(async (entityManager: EntityManager) => {
        await entityManager.delete(RoleAccessEntity, { roleId: Number(roleId), type: type});
        for (let item of accessList) {
          await entityManager.save(RoleAccessEntity, { roleId, accessId: Number(item), type})
        }
      }).then(async () => {
        return '成功';
      }).catch((e) => {
        Logger.error('角色分配资源错误', e);
        throw new HttpException('角色分配资源错误', HttpStatus.OK);
      });
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-23 13:29:54
   * @LastEditors: 水痕
   * @Description: 根据id或者uuid更新数据
   * @param {type} 
   * @return: 
   */
  public async updateById(id: string, data: any): Promise<any> {
    const result = await this.findById(id);
    if (result) {
      const { raw: { affectedRows } } = await this.roleRepository.update({ id: result.id }, data);
      if (affectedRows) {
        return await this.findById(id);
      } else {
        throw new HttpException(`传递的id:${id},修改数据失败`, HttpStatus.OK);
      }
    } else {
      throw new HttpException(`传递的id:${id},查无该条数据`, HttpStatus.OK);
    }
  }
}
