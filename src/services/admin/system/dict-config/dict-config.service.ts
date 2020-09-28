import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DictConfigEntry } from '@src/entities/model/system/dict.config.entity';
import { Repository, getConnection } from 'typeorm';
import { CreateDistConfigDto } from '@src/controllers/admin/system/dict-config/dto/update.dist.conf.dto';
import { UpdateDistConfigDto } from '@src/controllers/admin/system/dict-config/dto/create.dist.config.dto';
import { ObjectType } from '@src/types';
import { fileObjectField } from '@src/utils';

@Injectable()
export class DictConfigService {
  constructor (
    @InjectRepository(DictConfigEntry)
    private readonly dictConfigRepository: Repository<DictConfigEntry>,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2020-07-22 20:57:11
   * @LastEditors: 水痕
   * @Description: 添加数据
   * @param {type} 
   * @return: 
   */
  async createDistConfig(createDistConfigDto: CreateDistConfigDto): Promise<DictConfigEntry> {
    try {
      const { label, category, description } = createDistConfigDto;
      const distConfig = await this.dictConfigRepository.create({ label, category, description });
      return await this.dictConfigRepository.save(distConfig);
    } catch (e) {
      Logger.error(e, 'DistConfigService.createDistConfig');
      throw new HttpException('创建失败', HttpStatus.OK);
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-22 21:00:53
   * @LastEditors: 水痕
   * @Description: 根据id删除数据
   * @param {type} 
   * @return: 
   */
  async deleteById(id: number): Promise<string> {
    const { raw: { affectedRows } } = await this.dictConfigRepository.update({ id }, { isDel: 1 });
    if (affectedRows) {
      return '删除成功';
    } else {
      return '删除失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-22 21:04:27
   * @LastEditors: 水痕
   * @Description: 根据id修改配置项
   * @param {type} 
   * @return: 
   */
  async updateById(id: number, updateDistConfigDto: UpdateDistConfigDto): Promise<string> {
    const { raw: { affectedRows } } = await this.dictConfigRepository.update({ id }, updateDistConfigDto);
    if (affectedRows) {
      return '修改成功';
    } else {
      return '修改失败';
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-22 21:08:16
   * @LastEditors: 水痕
   * @Description: 分页查询数据
   * @param {type} 
   * @return: 
   */
  async findPage(queryOption: ObjectType): Promise<any> {
    const { pageSize = 10, pageNumber = 1, ...others } = queryOption || {};
    const [data, total] = await this.dictConfigRepository.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      where: fileObjectField({
        ...others,
        isDel: 0,
      })
    });
    return {
      data,
      total,
      pageNumber,
      pageSize,
    };
  }

  /**
   * @Author: 水痕
   * @Date: 2020-07-22 21:13:48
   * @LastEditors: 水痕
   * @Description: 根据分类查询字典
   * @param {type} 
   * @return: 
   */
  async findByCategory(category: string | string[]): Promise<any> {
    let categoryList = [];
    if (!category) return [];
    if (Array.isArray(category)) {
      categoryList = category;
    } else {
      categoryList = [category];
    }
    return await getConnection().createQueryBuilder(DictConfigEntry, 'dict')
      .where('dict.category in (:...categoryList) and dict.isDel=0', { categoryList })
      .getMany();
  }
}
