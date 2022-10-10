import { Column, Entity, Unique, Index } from 'typeorm';
import { SharedEntity } from '@src/modules/shared/entities/shared.entity';
import { StatusEnum } from '@src/enums';

@Entity('role')
@Unique('name_deleted', ['name', 'deletedAt'])
export class RoleEntity extends SharedEntity {
  @Index()
  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    name: 'name',
    comment: '角色名称',
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'description',
    comment: '角色描述',
  })
  description: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 1,
    name: 'status',
    comment: '状态1表示正常,0表示不正常',
  })
  status: StatusEnum;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: 0,
    name: 'is_default',
    comment: '针对后期提供注册用,1表示默认角色,0表示非默认角色',
  })
  isDefault: number;
}
