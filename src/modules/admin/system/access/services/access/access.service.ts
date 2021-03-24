import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAccessDto } from '../../controllers/access/dto/create.access.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessEntity } from '../../entities/access.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccessService {
  constructor (
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 08:23:35
   * @LastEditors: 水痕
   * @Description: 创建资源
   * @param {CreateAccessDto} createAccessDto
   * @return {*}
   */
  async createAccess(createAccessDto: CreateAccessDto): Promise<string> {
    const { moduleName, actionName } = createAccessDto;
    if (moduleName) {
      const result: AccessEntity | undefined = await this.accessRepository.findOne({ where: { moduleName }, select: ['id'] });
      if (result) {
        throw new HttpException(`${moduleName}当前模块名已经存在,不能重复创建`, HttpStatus.OK);
      }
    }
    if (actionName) {
      const result: AccessEntity | undefined = await this.accessRepository.findOne({ where: { actionName }, select: ['id'] });
      if (result) {
        throw new HttpException(`${actionName}当前操作名已经存在,不能重复创建`, HttpStatus.OK);
      }
    }
    const access = this.accessRepository.create(createAccessDto);
    await this.accessRepository.save(access);
    return '创建成功'
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 09:00:48
   * @LastEditors: 水痕
   * @Description: 根据资源id删除资源
   * @param {number} id
   * @return {*}
   */
  async destroyAccessById(id: number):Promise<string> {
    return '删除成功';
  }
}
