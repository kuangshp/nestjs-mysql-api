import { Entity, Column } from 'typeorm';
import { SharedEntity } from '@src/shared/entities/base.entity';

@Entity('account_token')
export class AccountTokenEntity extends SharedEntity {
  @Column({
    type: 'int',
    name: 'account_id',
    comment: '关联账号表的Id',
  })
  accountId!: number;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'token',
    comment: 'token',
  })
  token!: string;

  @Column({
    type: 'timestamp',
    name: 'expire_time',
    comment: '失效时间',
  })
  expireTime!: Date;
}
