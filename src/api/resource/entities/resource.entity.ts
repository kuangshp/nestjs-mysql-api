import { StatusEnum } from '@src/enums';
import { SharedEntity } from '@src/shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('resource')
export class ResourceEntity extends SharedEntity {
  @Column({
    type: 'varchar',
    length: 50,
    name: 'module_name',
    nullable: true,
    comment: '模块名称',
  })
  moduleName!: string;

  @Column({
    type: 'tinyint',
    name: 'type',
    nullable: true,
    comment: '类型,1:表示模块,2:表示接口(API)',
  })
  type!: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'action_name',
    nullable: true,
    comment: '操作名称',
  })
  actionName!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'api_name',
    nullable: true,
    comment: '接口名称',
  })
  apiName!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'url',
    nullable: true,
    comment: 'url地址',
  })
  url!: string;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'method',
    nullable: true,
    comment: '请求方式',
  })
  method!: string;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '1',
    comment: '状态,0表示禁止,1表示正常',
  })
  status!: StatusEnum;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'description',
    nullable: true,
    comment: '描素',
  })
  description!: string;
}
