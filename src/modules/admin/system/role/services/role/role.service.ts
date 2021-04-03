import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { Repository, getConnection } from 'typeorm';
import { CreateRoleDto } from '../../controllers/role/dto/create.role.dto';
import { UpdateRoleDto } from '../../controllers/role/dto/update.role.dto';
import { RoleResDto, RoleListResDtoDto } from '../../controllers/role/dto/role.res.dto';
import { RoleReqDto } from '../../controllers/role/dto/role.req.dto';
import { PageEnum, StatusEnum } from '@src/enums';
import { RoleEnum } from '@src/enums/role.enum';
import { AccountRoleEntity } from '../../../account/entities/account.role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(AccountRoleEntity)
    private readonly accountRoleRepository: Repository<AccountRoleEntity>,
  ) {}

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
    if (Object.is(isDefault, RoleEnum.DEFAULT)) {
      const findDefault = await this.roleRepository.findOne({
        where: { isDefault },
        select: ['id'],
      });
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
    // 判断当前角色是否已经被占用(有账号绑定了该角色)
    const accountRoleFindResult:
      | AccountRoleEntity
      | undefined = await this.accountRoleRepository.findOne({
      where: { roleId: id },
      select: ['id'],
    });
    if (accountRoleFindResult) {
      throw new HttpException('当前角色有账号与之绑定,不能直接删除', HttpStatus.OK);
    }
    const {
      raw: { affectedRows },
    } = await this.roleRepository.softDelete(id);
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 14:26:46
   * @LastEditors: 水痕
   * @Description: 根据角色id修改角色
   * @param {number} id
   * @param {UpdateRoleDto} updateRoleDto
   * @return {*}
   */
  async modifyRoleById(id: number, updateRoleDto: UpdateRoleDto): Promise<string> {
    const { isDefault } = updateRoleDto;
    if (Object.is(isDefault, String(RoleEnum.DEFAULT))) {
      const findResult = await this.roleRepository.findOne({
        where: { isDefault },
        select: ['id'],
      });
      if (findResult?.id !== id) {
        throw new HttpException('默认角色只能有一个', HttpStatus.OK);
      }
    }
    const {
      raw: { affectedRows },
    } = await this.roleRepository.update(id, updateRoleDto);
    if (affectedRows) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 14:40:13
   * @LastEditors: 水痕
   * @Description: 根据角色id查询角色
   * @param {number} id
   * @return {*}
   */
  async roleById(id: number): Promise<RoleResDto | undefined> {
    return await this.roleRepository.findOne(id);
  }

  /**
   * @Author: 水痕
   * @Date: 2021-03-23 14:46:45
   * @LastEditors: 水痕
   * @Description: 查询角色列表
   * @param {RoleReqDto} roleReqDto
   * @return {*}
   */
  async roleList(roleReqDto: RoleReqDto): Promise<RoleListResDtoDto> {
    const {
      pageNumber = PageEnum.PAGE_NUMBER,
      pageSize = PageEnum.PAGE_SIZE,
      name,
      status,
    } = roleReqDto;
    const queryConditionList = [];
    if (name) {
      queryConditionList.push('role.name LIKE :name');
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    if (
      /^\d$/.test(String(status)) &&
      [StatusEnum.NORMAL, StatusEnum.FORBIDDEN].includes(Number(status))
    ) {
      queryConditionList.push('role.status = :status');
    }
    const queryCondition = queryConditionList.join(' AND ');
    const [data, total] = await getConnection()
      .createQueryBuilder(RoleEntity, 'role')
      .where(queryCondition, { name: `%${name}%`, status })
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize)
      .printSql()
      .getManyAndCount();
    return {
      data,
      total,
      pageSize,
      pageNumber,
    };
  }
}
