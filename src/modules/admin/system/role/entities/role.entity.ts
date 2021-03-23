import { Column, Entity, Index, Unique } from 'typeorm';
import { PublicEntity } from '@src/modules/shared/entities/public.entity';


@Entity('role')
@Unique('name_deleted', ['name', 'deletedAt'])
export class RoleEntity extends PublicEntity {
  @Column( {
    type: 'varchar',
    nullable: false,
    length: 50,
    name: 'name',
    comment: '角色名称'
  })
  name: string;

  @Column( {
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'description',
    comment: '角色描素'
  })
  description: string | null;


  @Column({
    type: 'tinyint', 
    nullable: true,
    default: () => 1,
    name: 'status',
    comment: '状态1表示正常,0表示不正常'
  })
  status: number | null;

  @Column({
    type: 'tinyint',
    nullable: true,
    default: () => 0,
    name: 'is_default',
    comment: '针对后期提供注册用,默认开通的角色,1表示开通,0表示不开通'
  })
  isDefault: number | null;
}
