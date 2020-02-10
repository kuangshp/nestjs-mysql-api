import * as path from 'path';
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';

import { AdminModule } from './controllers/admin/admin.module';
import { LoggingInterceptor } from './interceptors/logging/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FrontModule } from './controllers/front/front.module';
import { CartGateway } from './gateway/cart/cart.gateway';

const entitiesPath =
  process.env.NODE_ENV === 'production'
    ? path.resolve('./**/*.entity.js')
    : path.resolve('./**/*.entity.ts');
Logger.log(process.env.NODE_ENV, '当前环境');


@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}'), {
      modifyConfigName: name => name.replace('.config', ''),
    }), // 配置加载配置文件
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: config.get('database.type'),
        host: config.get('database.host'),
        port: config.get('database.port'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),
        entities: [entitiesPath],
        synchronize: config.get('database.synchronize'),
        logging: config.get('database.logging'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    FrontModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    CartGateway,
  ],
})
export class AppModule { }
