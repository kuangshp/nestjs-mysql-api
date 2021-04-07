import { PageEnum } from './../../../../../../enums/page.enum';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateAccessDto } from '../../controllers/access/dto/create.access.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessEntity } from '../../entities/access.entity';
import { Repository, getConnection } from 'typeorm';
import { UpdateAccessDto } from '../../controllers/access/dto/update.access.dto';
import { AccessResDto, AccessListResDtoDto } from '../../controllers/access/dto/access.res.dto';
import { RoleAccessEntity } from '../../../role/entities/role.access.entity';
import { AccessReqDto } from '../../controllers/access/dto/access.req.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(AccessEntity)
    private readonly accessRepository: Repository<AccessEntity>,
    @InjectRepository(RoleAccessEntity)
    private readonly roleAccessRepository: Repository<RoleAccessEntity>,
  ) {}

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
      const result: AccessEntity | undefined = await this.accessRepository.findOne({
        where: { moduleName },
        select: ['id'],
      });
      if (result) {
        throw new HttpException(`${moduleName}当前模块名已经存在,不能重复创建`, HttpStatus.OK);
      }
    }
    if (actionName) {
      const result: AccessEntity | undefined = await this.accessRepository.findOne({
        where: { actionName },
        select: ['id'],
      });
      if (result) {
        throw new HttpException(`${actionName}当前操作名已经存在,不能重复创建`, HttpStatus.OK);
      }
    }
    const access = this.accessRepository.create(createAccessDto);
    await this.accessRepository.save(access);
    return '创建成功';
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 09:00:48
   * @LastEditors: 水痕
   * @Description: 根据资源id删除资源
   * @param {number} id
   * @return {*}
   */
  async destroyAccessById(id: number): Promise<string> {
    if (id <= 8) {
      throw new HttpException('系统默认生成的资源不能删除', HttpStatus.OK);
    }
    // 1.判断是否有角色关联到当前资源
    const roleAccessResult: RoleAccessEntity | undefined = await this.roleAccessRepository.findOne({
      where: { accessId: id },
      select: ['id'],
    });
    if (roleAccessResult) {
      throw new HttpException('当前资源已经被角色绑定不能直接删除', HttpStatus.OK);
    }
    // 2.查看该节点下是否有子节点
    const childNode: AccessEntity | undefined = await this.accessRepository.findOne({
      where: { parentId: id },
      select: ['id'],
    });
    if (childNode) {
      throw new HttpException('当前节点下含子节点,不能直接删除', HttpStatus.OK);
    }
    const {
      raw: { affectedRows },
    } = await this.accessRepository.softDelete(id);
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 12:36:51
   * @LastEditors: 水痕
   * @Description: 根据资源id修改资源
   * @param {number} id
   * @param {UpdateAccessDto} updateAccessDto
   * @return {*}
   */
  async modifyAccessById(id: number, updateAccessDto: UpdateAccessDto): Promise<string> {
    if (id <= 8) {
      throw new HttpException('系统默认生成的资源不能修改', HttpStatus.OK);
    }
    const {
      raw: { affectedRows },
    } = await this.accessRepository.update(id, updateAccessDto);
    if (affectedRows) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 21:24:53
   * @LastEditors: 水痕
   * @Description: 获取全部的菜单给分配角色的时候用
   * @param {*}
   * @return {*}
   */
  async accessList(): Promise<AccessResDto[]> {
    return await this.accessRepository.find({
      where: [{ type: 1 }, { type: 2 }],
      select: ['id', 'moduleName', 'actionName', 'sort'],
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-24 14:01:01
   * @LastEditors: 水痕
   * @Description: 分页获取资源
   * @param {number} type
   * @return {*}
   */
  async accessListPage(accessReqDto: AccessReqDto): Promise<AccessListResDtoDto> {
    const {
      pageSize = PageEnum.PAGE_SIZE,
      pageNumber = PageEnum.PAGE_NUMBER,
      parentId = 0,
    } = accessReqDto;
    const [data, total] = await getConnection()
      .createQueryBuilder(AccessEntity, 'access')
      .where('access.parentId = :parentId', { parentId })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .orderBy({ 'access.sort': 'ASC', 'access.createdAt': 'DESC' })
      .printSql()
      .getManyAndCount();
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }
}
