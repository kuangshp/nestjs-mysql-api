import { Injectable } from '@nestjs/common';
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
    return '创建成功'
  }
}
