import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from '@src/service/base/base.service';
import { AccessEntity } from '@src/entities/access.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleAccessEntity } from '@src/entities/role_access.entity';
import { sqlParamsJoin } from '@src/utils';
import { CreateAccessDto } from '@src/controllers/admin/system/access/dto/create.access.dto';
import { ObjectType } from '@src/types';

@Injectable()
export class AccessService extends BaseService {
  constructor (
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>
  ) {
    super(accessRepository);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-27 14:24:24
   * @LastEditors: 水痕
   * @Description: 查询数据
   * @param {type} 
   * @return: 
   */
  public async findPage(querOption: any): Promise<any> {
    return await this.accessRepository.find();
  }
  /**
   * @Author: 水痕
   * @Date: 2020-01-27 12:40:41
   * @LastEditors: 水痕
   * @Description: 创建资源
   * @param {type} 
   * @return: 
   */
  public async create(data: CreateAccessDto): Promise<any> {
    try {
      const { moduleName, actionName } = data;
      if (moduleName) {
        const result = await this.findOne({ moduleName });
        if (result) {
          throw new HttpException(`你修改的moduleName:${moduleName},数据库已经存在,不能重名`, HttpStatus.OK);
        }
      }
      if (actionName) {
        const result = await this.findOne({ actionName });
        if (result) {
          throw new HttpException(`你修改的actionName:${actionName},数据库已经存在,不能重名`, HttpStatus.OK);
        }
      }
      const access = await this.accessRepository.create(data);
      await this.accessRepository.save(access);
      return access;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.OK);
    }
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
    try {
      const result = await this.findById(id);
      if (result) {
        const sql = `update access set ${sqlParamsJoin(data)} where id=${result.id}`;
        const { affectedRows } = await this.accessRepository.query(sql);
        if (affectedRows) {
          return await this.findById(id);
        } else {
          throw new HttpException(`传递的id:${id},修改数据失败`, HttpStatus.OK);
        }
      } else {
        throw new HttpException(`传递的id:${id},查无该条数据`, HttpStatus.OK);
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.OK);
    }
  }
  /**
   * @Author: 水痕
   * @Date: 2020-01-24 12:40:29
   * @LastEditors: 水痕
   * @Description: 删除权限,先判断该权限是否关联了角色
   * @param {type} 
   * @return: 
   */
  async deleteById(id: string): Promise<string> {
    /**
     * 1.先判断是否有该资源
     * 2.判断角色资源表中是否存在
     * 3.删除
     */
    let accessResult: any = '';
    if (this.validator.isUUID(id)) {
      accessResult = await this.accessRepository.findOne({ uuid: id });
    } else if (this.validator.isInt(Number.parseInt(id))) {
      accessResult = await this.accessRepository.findOne({ id: Number(id) });
    } else {
      throw new HttpException(`传递的id必须是整形或者是uuid字符串,你传递的是:${id}`, HttpStatus.OK);
    }
    // 1.判断该资源不存在
    if (!accessResult) {
      throw new HttpException(`传递的${id}资源不存在,请重新输入`, HttpStatus.OK);
    }
    // 2.查询是否有关联
    const accessId: number = accessResult.id;
    const roleAccessResult = await this.roleAccessRepository.findOne({ where: { accessId } });
    if (roleAccessResult) {
      throw new HttpException('不能直接删除,有角色与该角色关联了', HttpStatus.OK);
    }
    // 3.查看该节点下是否有子节点
    const childTick = await this.accessRepository.findOne({ moduleId: accessId });
    if (childTick) {
      throw new HttpException('不能直接删除,该节点下面还有子节点', HttpStatus.OK);
    }
    // 4.直接删除
    const { affected } = await this.accessRepository.delete({ id: accessId });
    if (affected) {
      return '删除成功';
    } else {
      return null;
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-27 13:08:11
   * @LastEditors: 水痕
   * @Description: 获取全部的模块
   * @param {type} 
   * @return: 
   */
  public async moduleList(type: string): Promise<any> {
    return await this.accessRepository.find({
      type,
      status: 1,
    })
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-28 10:27:35
   * @LastEditors: 水痕
   * @Description: 获取菜单列表
   * @param {type} 
   * @return: 
   */
  public async menusList(userInfo: ObjectType): Promise<any> {
    /**
     * 根据权限判断返回菜单的主要步骤
     * 1.获取全部的菜单
     * 2.如果是超级管理员就直接全部的返回-->根据字段isSuper=1
     * 3.根据当前的角色id【roleId】获取角色拥有的权限-->到role_access表中获取
     * 4.遍历循环所有的权限数据,判断当前权限是否在角色权限的数组中
     */
    const { isSuper, roleId } = userInfo;
    // 1.获取全部的菜单并且格式化
    const resultList = await this.accessRepository.createQueryBuilder('access').where('status=1 and type=1 or type=2').getMany();
    const formatMenus = resultList.map(item => {
      const { id, moduleName, actionName, moduleId, url, sort, icon } = item;
      return {
        id,
        url,
        sort,
        icon,
        parentId: moduleId,
        name: moduleName ? moduleName : actionName,
      }
    })
    // 2.如果是超级管理员就直接全部返回
    if (Object.is(isSuper, 1)) {
      return formatMenus;
    }
    // 3.根据当前用户角色roleId到role_access表中获取全部的权限
    let alreadySelectedAccessList = await this.roleAccessRepository.find({ where: { roleId, type: '1' } });
    const alreadySelectedAccessIdList = alreadySelectedAccessList.map(item => item.accessId);
    return formatMenus.filter((item: any) => alreadySelectedAccessIdList.includes(item.id))
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-29 11:20:37
   * @LastEditors: 水痕
   * @Description: 获取角色权限
   * @param {type} 
   * @return: 
   */
  async authorizationList(type: number, roleId: number): Promise<any> {
    // 获取已经设置的权限
    const alreadyAccesList = await this.roleAccessRepository.createQueryBuilder('rc')
      .andWhere('(rc.type= :type and rc.roleId=:roleId)', { type, roleId })
      .select(['rc.accessId']).getMany()
    // 提取全部的id
    const alreadyAccesIdList = alreadyAccesList.map(item => item.accessId);
    if (Object.is(type, 1)) {
      // 请求菜单权限
      const result = await this.accessRepository.createQueryBuilder('ac').where('status=1 and type=1 or type=2')
        .select(['ac.id', 'ac.moduleName', 'ac.actionName', 'ac.moduleId']).getMany();
      return result.map((item: any) => {
        return {
          id: item.id,
          title: item.moduleName ? item.moduleName : item.actionName,
          parentid: item.moduleId,
          direction: alreadyAccesIdList.includes(item.id) ? 'right' : 'left',
        }
      })
    } else if (Object.is(type, 2)) {
      // 请求接口的权限
      const result = await this.accessRepository.createQueryBuilder('ac').where('status=1 and type=2 or type=3')
        .select(['ac.id', 'ac.moduleName', 'ac.type', 'ac.actionName', 'ac.moduleId']).getMany();
      return result.map((item: any) => {
        return {
          id: item.id,
          title: item.moduleName ? item.moduleName : item.actionName,
          parentid: item.type == 2 ? 0 : item.moduleId,
          direction: alreadyAccesIdList.includes(item.id) ? 'right' : 'left',
        }
      })
    } else {
      throw new HttpException(`传统的参数有错误,只能传递1或2,你传递的是:${type}`, HttpStatus.OK);
    }
  }
}
