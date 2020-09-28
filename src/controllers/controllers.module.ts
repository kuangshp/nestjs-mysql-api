import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';


@Module({
  imports: [
    AdminModule,
    SharedModule,
  ],
  exports: [
    AdminModule,
    SharedModule,
  ],
  controllers: []
})
export class ControllersModule { }
