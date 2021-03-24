import { Entity, Unique, Column } from 'typeorm';
import { PublicEntity } from '@src/modules/shared/entities/public.entity';

@Entity('role_access')
@Unique('role_access_type_deleted', ['roleId', 'accessId','type','deletedAt'])
export class RoleAccessEntity extends PublicEntity {
  @Column({
    type: 'int',
    nullable: false,
    name: 'role_id',
    comment: '角色id'
  })
  roleId: number;

  @Column({
    type: 'int',
    nullable: false,
    name: 'access_id',
    comment: '资源id'
  })
  accessId: number;

  @Column({
    type: 'tinyint',
    name: 'type',
    comment: '资源类型:2:表示菜单,3:表示接口(API)'
  })
  type: number;
}