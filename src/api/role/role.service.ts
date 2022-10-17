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
}
