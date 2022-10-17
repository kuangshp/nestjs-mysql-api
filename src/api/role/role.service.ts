import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEnum, StatusEnum } from '@src/enums';
import { LoggerService } from '@src/plugin/logger/logger.service';
import { mapToObj } from '@src/utils';
import { FindOperator, ILike, Repository } from 'typeorm';
import { RoleDto } from './dto/role.dto';
import { QueryRoleDto } from './dto/role.query.dto';
import { RoleEntity } from './entities/role.entity';
import { RoleListVo, RolePageVo, RoleVo } from './vo/role.vo';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly loggerService: LoggerService
  ) {}

  /**
   * @Author: 水痕
   * @Email: kuangshp@126.com
   * @Date: 2022-10-17 21:10:38
   * @LastEditors:
   * @LastEditTime:
   * @Description: 创建角色
   * @param {RoleDto} roleDto
   * @return {*}
   */
  async createRole(roleDto: RoleDto): Promise<string> {
    // 1.判断角色名称是否已经存在
    const findRoleName: Pick<RoleEntity, 'id'> | null = await this.roleRepository.findOne({
      where: { name: roleDto.name },
      select: ['id'],
    });
    if (findRoleName?.id) {
      throw new HttpException(`【${roleDto.name}】已经存在,不能重复创建`, HttpStatus.OK);
    }
    // 2.如果当前是默认角色的时候判断是否已经存在默认角色
    if (roleDto?.isDefault) {
      const findRoleIsDefault: Pick<RoleEntity, 'id'> | null = await this.roleRepository.findOne({
        where: { isDefault: 1 },
        select: ['id'],
      });
      if (findRoleIsDefault?.id) {
        throw new HttpException(`默认角色已经存在已经存在,不能重复创建默认角色`, HttpStatus.OK);
      }
    }
    // 3.创建角色
    try {
      const role = this.roleRepository.create(roleDto);
      await this.roleRepository.save(role);
      return '创建成功';
    } catch (err: any) {
      this.loggerService.error(`创建角色失败:【${err.message}】`, RoleService.name);
      throw new HttpException('创建角色失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Email: kuangshp@126.com
   * @Date: 2022-10-17 21:49:18
   * @LastEditors:
   * @LastEditTime:
   * @Description: 根据id删除角色
   * @param {number} id
   * @return {*}
   */
  async deleteRoleById(id: number): Promise<string> {
    const { affected } = await this.roleRepository.softDelete(id);
    if (affected) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Email: kuangshp@126.com
   * @Date: 2022-10-17 22:09:50
   * @LastEditors:
   * @LastEditTime:
   * @Description: 根据id修改角色状态
   * @param {number} id
   * @return {*}
   */
  async modifyRoleStatusById(id: number): Promise<string> {
    const roleEntity: Pick<RoleEntity, 'status'> | null = await this.roleRepository.findOne({
      where: { id },
      select: ['status'],
    });
    if (!roleEntity) {
      throw new HttpException('传递的角色id错误', HttpStatus.OK);
    }
    const { affected } = await this.roleRepository.update(id, {
      status:
        roleEntity?.status === StatusEnum.FORBIDDEN ? StatusEnum.NORMAL : StatusEnum.FORBIDDEN,
    });
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Email: kuangshp@126.com
   * @Date: 2022-10-17 21:51:36
   * @LastEditors:
   * @LastEditTime:
   * @Description: 根据id修改角色
   * @param {number} id
   * @param {RoleDto} roleDto
   * @return {*}
   */
  async modifyRoleById(id: number, roleDto: Omit<RoleDto, 'status'>): Promise<string> {
    // 1.如果当前是默认角色的时候判断是否已经存在
    if (roleDto.isDefault) {
      const findRoleIsDefault: Pick<RoleEntity, 'id'> | null = await this.roleRepository.findOne({
        where: { isDefault: 1 },
        select: ['id'],
      });
      if (findRoleIsDefault?.id !== id) {
        throw new HttpException(`默认角色已经存在已经存在,不能重复创建默认角色`, HttpStatus.OK);
      }
    }
    // 2.判断角色名称是否存在
    const findRoleName: Pick<RoleEntity, 'id'> | null = await this.roleRepository.findOne({
      where: { name: roleDto.name },
      select: ['id'],
    });
    if (findRoleName?.id === id) {
      throw new HttpException(`【${roleDto.name}】已经存在,不能重复`, HttpStatus.OK);
    }
    const { affected } = await this.roleRepository.update(id, roleDto);
    if (affected) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Email: kuangshp@126.com
   * @Date: 2022-10-17 22:32:36
   * @LastEditors:
   * @LastEditTime:
   * @Description: 给下拉框使用获取角色列表
   * @return {*}
   */
  async getRoleList(): Promise<RoleListVo[]> {
    return await this.roleRepository.find({
      where: { status: StatusEnum.NORMAL },
      select: ['id', 'name'],
      order: { id: 'desc' },
    });
  }

  /**
   * @Author: 水痕
   * @Email: kuangshp@126.com
   * @Date: 2022-10-17 22:41:23
   * @LastEditors:
   * @LastEditTime:
   * @Description: 根据角色id获取角色信息
   * @param {number} id
   * @return {*}
   */
  async getRoleById(id: number): Promise<RoleVo | null> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  /**
   * @Author: 水痕
   * @Email: kuangshp@126.com
   * @Date: 2022-10-17 22:22:24
   * @LastEditors:
   * @LastEditTime:
   * @Description: 分页获取角色列表
   * @param {*} queryOptions
   * @return {*}
   */
  async getRolePage(queryOptions: QueryRoleDto): Promise<RolePageVo> {
    const { pageNumber = PageEnum.PAGE_NUMBER, pageSize = PageEnum.PAGE_SIZE, name } = queryOptions;
    const queryMap = new Map<string, FindOperator<string>>();
    if (name) {
      queryMap.set('name', ILike(`%${name}%`));
    }
    const [data, total] = await this.roleRepository
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
      pageNumber,
      pageSize,
    };
  }
}
