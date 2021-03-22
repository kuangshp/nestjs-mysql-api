import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { FrontModule } from './modules/front/front.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [AdminModule, FrontModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
