import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';

import { AccessEntity } from '@src/entities/model/system/access.entity';
import { CreateAccessDto } from '@src/controllers/admin/system/access/dto/create.access.dto';
import { UpdateAccessDto } from '@src/controllers/admin/system/access/dto/update.access.dto';
import { ObjectType } from '@src/types';

@Injectable()
export class AccessService {
  constructor (
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2020-05-19 08:07:18
   * @LastEditors: 水痕
   * @Description: 创建资源
   * @param {type} 
   * @return: 
   */
  async createAccess(createAccessDto: CreateAccessDto): Promise<any> {
    try {
      const { moduleName, actionName } = createAccessDto;
      if (moduleName) {
        const result = await this.accessRepository.findOne({ where: { moduleName } })
        if (result) {
          throw new HttpException(`你修改的moduleName:${moduleName},数据库已经存在,不能重名`, HttpStatus.OK);
        }
      }
      if (actionName) {
        const result = await this.accessRepository.findOne({ where: { actionName, moduleName } });
        if (result) {
          throw new HttpException(`你修改的actionName:${actionName},数据库已经存在,不能重名`, HttpStatus.OK);
        }
      }
      const access = await this.accessRepository.create(createAccessDto);
      return await this.accessRepository.save(access);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-19 08:10:59
   * @LastEditors: 水痕
   * @Description: 根据id删除资源
   * @param {type} 
   * @return: 
   */
  async deleteById(id: number): Promise<any> {
    // 判断如果有子节点的时候就不能删除
    const isChildren = await this.accessRepository.findOne({ where: { moduleId: id, isDel: 0 } });
    if (isChildren) {
      throw new HttpException('该节点下含有子节点不能直接删除', HttpStatus.OK);
    }
    const { raw: { affectedRows } } = await this.accessRepository.update(id, { isDel: 1 });
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-19 08:14:34
   * @LastEditors: 水痕
   * @Description: 根据id更改资源
   * @param {type} 
   * @return: 
   */
  async updateById(id: number, data: UpdateAccessDto): Promise<any> {
    const { raw: { affectedRows } } = await this.accessRepository.update({ id }, data);
    if (affectedRows) {
      return '修改成功';
    } else {
      throw new HttpException(`传递的id:${id},修改数据失败`, HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-19 08:20:33
   * @LastEditors: 水痕
   * @Description: 根据类型获取全部的模块
   * @param {type} 
   * @return: 
   */
  async moduleList(): Promise<any> {
    return await this.accessRepository.find({ where: { moduleId: -1, isDel: 0 }, select: ['moduleName', 'id'] });
  }

  /**
   * @Author: 水痕
   * @Date: 2020-05-19 08:23:05
   * @LastEditors: 水痕
   * @Description: 分页查找全部的资源
   * @param {type} 
   * @return: 
   */
  async accessList(queryOption: ObjectType): Promise<any> {
    const { pageSize = 10, pageNumber = 1, type = 1, id = -1 } = queryOption;
    const [data, total] = await getConnection().createQueryBuilder(AccessEntity, 'access')
      .andWhere('(access.moduleId=:id and access.isDel=0)', { type, id })
      .orderBy({ 'access.sort': 'ASC' })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();
    const newData = [];
    // 判断是否有子节点
    for (const item of data) {
      const isExist = await this.accessRepository.findOne({ where: { moduleId: item.id } });
      if (isExist) {
        newData.push({ ...item, children: true });
      } else {
        newData.push({ ...item, children: false });
      }
    }
    return {
      data: newData,
      total,
      pageNumber,
      pageSize,
    }
  }
}
