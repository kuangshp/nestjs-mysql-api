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
  })
  name: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_at',
  })
  updateAt: Date;
}
