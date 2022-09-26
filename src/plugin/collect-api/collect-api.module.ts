import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CollectApiService } from './services/collect-api.service';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [CollectApiService],
  exports: [CollectApiService],
})
export class CollectApiModule {}
