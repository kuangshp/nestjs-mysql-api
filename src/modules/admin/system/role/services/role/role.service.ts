import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from '../../controllers/role/dto/create.role.dto';

@Injectable()
export class RoleService {
  constructor (
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 13:38:11
   * @LastEditors: 水痕
   * @Description: 创建角色
   * @param {CreateRoleDto} createRoleDto
   * @return {*}
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<string> {
    const { name, isDefault } = createRoleDto;
    const findNameResult = await this.roleRepository.findOne({ where: { name }, select: ['id'] });
    if (findNameResult) {
      throw new HttpException(`${name}当前角色已经存在,不能重复创建`, HttpStatus.OK);
    }
    // 如果是默认角色的时候要判断下
    if (isDefault) {
      const findDefault = await this.roleRepository.findOne({ where: { isDefault }, select: ['id'] });
      if (findDefault) {
        throw new HttpException('已经存在默认角色不能重复创建', HttpStatus.OK);
      }
    }
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return '创建角色成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 14:15:06
   * @LastEditors: 水痕
   * @Description: 根据角色id删除角色
   * @param {number} id
   * @return {*}
   */
  async destroyRoleById(id: number): Promise<string> {
    const { raw: { affectedRows } } = await this.roleRepository.softDelete(id);
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }
}
