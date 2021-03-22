import { Module } from '@nestjs/common';
import { AdminModule } from './modules/admin/admin.module';
import { FrontModule } from './modules/front/front.module';
import { CommonModule } from './modules/common/common.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors/logging/logging.interceptor';
import { ValidationPipe } from './pipe/validation/validation.pipe';

@Module({
  imports: [AdminModule, FrontModule, CommonModule],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // 全局使用管道(数据校验)
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
  ],
})
export class AppModule {}
