import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '@src/entities/model/system/role.entity';
import { Repository, getConnection, getManager, EntityManager } from 'typeorm';
import { CreateRoleDto } from '@src/controllers/admin/system/role/dto/create.role.dto';
import { ToolsService } from '@src/services/tools/tools.service';
import { UpdateRoleDto } from '@src/controllers/admin/system/role/dto/update.role.dto';
import { ObjectType } from '@src/types';
import { AccountRoleEntity } from '@src/entities/model/system/account_role.entity';
import { RoleAccessEntity } from '@src/entities/model/system/role_access.entity';

@Injectable()
export class RoleService {
  constructor (
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
    private readonly toolsService: ToolsService,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 17:12:52
   * @LastEditors: 水痕
   * @Description: 创建角色
   * @param {type} 
   * @return: 
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<string> {
    try {
      const { title, description, accessIdsList } = createRoleDto;
      const isExists = await this.roleRepository.findOne({ where: { title } });
      if (isExists) {
        throw new HttpException(`${title}角色已经存在不能重复添加`, HttpStatus.OK);
      }
      return getManager()
        .transaction(async (entityManager: EntityManager) => {
          const currentRole: ObjectType = await entityManager.save(RoleEntity, { title, description });
          // 如果权限有就添加权限
          if (accessIdsList) {
            const accessList = accessIdsList.split(',');
            for (const item of accessList) {
              await entityManager.save(RoleAccessEntity, { roleId: currentRole.id, accessId: Number(item) });
            }
          }
        }).then(async () => {
          return '创建成功';
        }).catch((e) => {
          console.log('创建账号', e);
          throw new HttpException('创建失败', HttpStatus.OK);
        })
    } catch (e) {
      throw new HttpException(e, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 17:16:21
   * @LastEditors: 水痕
   * @Description: 根据角色id删除角色
   * @param {type} 
   * @return: 
   */
  async deleteById(id: number): Promise<string> {
    // 查询如果有账号的时候就不能删除
    const isExistAccount = await this.accountRoleRepository.findOne({ where: { roleId: id } });
    if (isExistAccount) {
      throw new HttpException('该角色下面有账号,不能删除,如果要删除请先解绑', HttpStatus.OK);
    }
    const { raw: { affectedRows } } = await this.roleRepository.update(id, { isDel: 1 });
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 17:22:35
   * @LastEditors: 水痕
   * @Description: 根据角色id修改角色
   * @param {type} 
   * @return: 
   */
  async updateById(id: number, updateRoleDto: UpdateRoleDto): Promise<string> {
    try {
      console.log(updateRoleDto, '修改数据')
      const { title, description, accessIdsList } = updateRoleDto;
      // 先判断之前数据库是否已经存在
      const findRoleResult = await this.roleRepository.findOne({ where: { title } });
      if (findRoleResult && findRoleResult.id != id) {
        throw new HttpException('你修改的角色已经存在,不能重名', HttpStatus.OK);
      }
      return getManager()
        .transaction(async (entityManager: EntityManager) => {
          // 修改账号信息
          await entityManager.update(RoleEntity, id, { title, description });
          const accessList = accessIdsList.split(',');
          // 删除之前的(根据角色id删除)
          await entityManager.delete(RoleAccessEntity, { roleId: id });
          // 如果权限有就添加权限
          if (accessIdsList) {
            // 新增现在的
            for (const item of accessList) {
              await entityManager.save(RoleAccessEntity, { roleId: id, accessId: Number(item) });
            }
          }
        }).then(async () => {
          return '修改成功';
        }).catch((e) => {
          console.log('修改账号', e);
          throw new HttpException('修改失败', HttpStatus.OK);
        })
    } catch (e) {
      throw new HttpException(e, HttpStatus.OK)
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 17:52:37
   * @LastEditors: 水痕
   * @Description: 根据角色id查询到角色
   * @param {type} 
   * @return: 
   */
  async findById(id: number): Promise<any> {
    return await this.roleRepository.findOne({ id, isDel: 0 });
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-18 17:54:08
   * @LastEditors: 水痕
   * @Description: 获取角色列表
   * @param {type} 
   * @return: 
   */
  async roleList(queryOption: ObjectType): Promise<any> {
    const { pageSize = 10, pageNumber = 1 } = queryOption;
    this.toolsService.checkPage(pageSize, pageNumber);
    const [data, total] = await getConnection().createQueryBuilder(RoleEntity, 'role')
      .andWhere('(role.isDel = :isDel)', { isDel: 0 })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();
    return {
      data,
      total,
      pageNumber,
      pageSize,
    }
  }
}
