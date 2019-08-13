import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 10,
    name: 'name',
    comment: '角色名称',
  })
  name: string;

  @Column('varchar', {
    nullable: true,
    length: 100,
    comment: '描素',
  })
  description: string;

  @Column('tinyint', {
    nullable: false,
    default: 1,
    comment: '是否可用',
    name: 'is_active',
  })
  isActive: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_at',
    comment: '创建时间',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_at',
    comment: '最后更新时间',
  })
  updateAt: Date;
}
