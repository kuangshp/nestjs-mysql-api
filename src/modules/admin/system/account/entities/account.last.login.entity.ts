import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { IpToAddressService } from '@src/modules/common/tencent-map/ip-to-address/ip-to-address.service';

@Entity('account_last_login')
export class AccountLastLoginEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '主键id',
  })
  id: number;

  @Column({
    type: 'int',
    name: 'account_id',
    comment: '账号id',
  })
  accountId: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 60,
    name: 'last_login_ip',
    comment: '最后登录id',
  })
  lastLoginIp: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    name: 'last_login_address',
    comment: '最后登录地址',
  })
  lastLoginAddress: string | null;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_login_time',
    comment: '最后登录时间',
  })
  lastLoginTime: Date;

  @BeforeInsert()
  async generateLastLoginAddress() {
    // 调用第三方,根据ip地址查询到地址
    const ipToAddressService = new IpToAddressService();
    if (this.lastLoginIp) {
      this.lastLoginAddress = await ipToAddressService.IpToAddress(this.lastLoginIp);
    }
  }
}
