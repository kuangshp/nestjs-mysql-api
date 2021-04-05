import { Module, Global } from '@nestjs/common';
import { TencentMapModule } from './tencent-map/tencent-map.module';

@Global()
@Module({
  imports: [TencentMapModule],
})
export class CommonModule {}
