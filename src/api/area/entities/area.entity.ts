import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('area')
export class AreaEntity extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
    comment: '主键id',
  })
  id!: number;

  @Column({
    type: 'int',
    name: 'pid',
    nullable: true,
    comment: '父id',
  })
  pid!: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'shortname',
    nullable: true,
    comment: '简称',
  })
  shortname!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'name',
    nullable: true,
    comment: '名称',
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'merger_name',
    nullable: true,
    comment: '全称',
  })
  mergerName!: string;

  @Column({
    type: 'tinyint',
    name: 'level',
    nullable: true,
    comment: '层级 0 1 2 省市区县',
  })
  level!: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'pinyin',
    nullable: true,
    comment: '拼音',
  })
  pinyin!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'code',
    nullable: true,
    comment: '长途区号',
  })
  code!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'zip_code',
    nullable: true,
    comment: '邮编',
  })
  zipCode!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'first',
    nullable: true,
    comment: '首字母',
  })
  first!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'lng',
    nullable: true,
    comment: '经度',
  })
  lng!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'lat',
    nullable: true,
    comment: '纬度',
  })
  lat!: string;
}
