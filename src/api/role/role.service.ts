import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerService } from '@src/plugin/logger/logger.service';
import { Repository } from 'typeorm';
import { RoleDto } from './dto/role.dto';
import { RoleEntity } from './entities/role.entity';

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
}
