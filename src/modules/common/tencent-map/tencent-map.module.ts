import { Module } from '@nestjs/common';
import { IpToAddressService } from './ip-to-address/ip-to-address.service';

@Module({
  providers: [IpToAddressService],
})
export class TencentMapModule {}
