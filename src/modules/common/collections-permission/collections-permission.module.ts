import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CollectionsPermissionService } from './services/collections.permission.service';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [CollectionsPermissionService],
  exports: [CollectionsPermissionService],
})
export class CollectionsPermissionModule {}
