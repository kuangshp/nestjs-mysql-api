import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_extend', { schema: 'koa1' })
export class UserExtendEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  id: number;

  @Column('timestamp', {
    nullable: true,
    name: 'birthday',
  })
  birthday: Date;

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'company',
  })
  company: string | null;

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'position',
  })
  position: string | null;

  @Column('varchar', {
    nullable: true,
    length: 100,
    name: 'address',
  })
  address: string | null;

  @Column('varchar', {
    nullable: true,
    length: 200,
    name: 'avatar',
  })
  avatar: string | null;

  @Column('int', {
    name: 'user_id',
  })
  userId: number;
}
