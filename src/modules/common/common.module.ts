import { Module, Global } from '@nestjs/common';
import { CollectionsPermissionModule } from './collections-permission/collections-permission.module';
import { TencentMapModule } from './tencent-map/tencent-map.module';

@Global()
@Module({
  imports: [TencentMapModule, CollectionsPermissionModule],
})
export class CommonModule {}
