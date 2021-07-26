import { SharedEntity } from '@src/modules/shared/entities/shared.entity';
import { Column, Entity } from 'typeorm';

@Entity('account_token')
export class AccountTokenEntity extends SharedEntity {
  @Column({
    type: 'int',
    nullable: false,
    unique: true,
    name: 'user_id',
    comment: '关联用户表的ID',
  })
  userId: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true,
    name: 'token',
    comment: 'token',
  })
  token: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 45,
    name: 'username',
    comment: '用户名',
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 110,
    name: 'mobile',
    comment: '手机号码',
  })
  mobile: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 30,
    name: 'platform',
    comment: '平台',
  })
  platform: string;

  @Column({
    type: 'timestamp',
    name: 'expire_time',
    nullable: false,
    comment: '失效时间',
  })
  expireTime: Date;
}
