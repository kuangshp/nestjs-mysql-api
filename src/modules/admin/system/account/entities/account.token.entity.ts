import { PlatformEnum } from '@src/enums';
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
    length: 11,
    name: 'mobile',
    comment: '手机号码',
  })
  mobile: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    name: 'email',
    comment: '邮箱',
  })
  email: string;

  @Column({
    type: 'tinyint',
    nullable: true,
    name: 'platform',
    default: 0,
    comment: '平台:0表示普通用户(没权限),1表示为运营管理,2表示入住商家',
  })
  platform: PlatformEnum;

  @Column({
    type: 'tinyint',
    nullable: false,
    default: 0,
    name: 'is_super',
    comment: '是否为超级管理员1表示是,0表示不是',
  })
  isSuper: number;

  @Column({
    type: 'timestamp',
    name: 'expire_time',
    nullable: true,
    comment: '失效时间',
  })
  expireTime: Date;
}
