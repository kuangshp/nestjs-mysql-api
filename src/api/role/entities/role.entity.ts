import { StatusEnum } from '@src/enums';
import { SharedEntity } from '@src/shared/entities/base.entity';
import { Expose } from 'class-transformer';
import { Entity, Column } from 'typeorm';

@Entity('role')
export class RoleEntity extends SharedEntity {
  @Column({
    type: 'varchar',
    length: 50,
    name: 'name',
    comment: '角色名称',
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'description',
    nullable: true,
    comment: '角色描素',
  })
  description!: string;

  @Column({
    type: 'tinyint',
    name: 'status',
    nullable: true,
    default: '1',
    comment: '状态1表示正常,0表示不正常',
  })
  status!: StatusEnum;

  @Column({
    type: 'tinyint',
    name: 'is_default',
    nullable: true,
    default: '0',
    comment: '针对后期提供注册用,1表示默认角色,0表示非默认角色',
  })
  isDefault!: number;

  @Expose()
  statusStr(): string {
    return this.status === 0 ? '禁止' : '正常';
  }
}
