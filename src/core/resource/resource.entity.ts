import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resource')
export class ResourceEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 100,
    name: 'name',
    comment: '资源名称',
  })
  name: string;

  @Column('tinyint', {
    nullable: false,
    default: 1,
    name: 'is_active',
    comment: '是否可用',
  })
  isActive: number;

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'description',
    comment: '描素',
  })
  description: string | null;

  @Column('int', {
    nullable: false,
    default: 0,
    name: 'parent_id',
    comment: '父资源id',
  })
  parentId: number;

  @CreateDateColumn({
    name: 'create_at',
    comment: '创建时间',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    comment: '最后更新时间',
  })
  updateAt: Date;
}
