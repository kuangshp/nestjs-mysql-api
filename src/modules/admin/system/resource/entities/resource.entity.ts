import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resource')
export class ResourceEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'module_name',
    comment: '模块名称',
  })
  moduleName: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'method_name',
    comment: '方法名称',
  })
  methodName: string;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'method',
    comment: '请求方式',
  })
  method: string;

  @Column({
    type: 'varchar',
    length: 200,
    name: 'url',
    comment: '请求地址',
  })
  url: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date | number;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;
}
