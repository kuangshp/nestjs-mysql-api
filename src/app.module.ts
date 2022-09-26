import { ClassSerializerInterceptor, Logger, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getConfig } from './utils';
import { LoggerInterceptor, RedisCacheInterceptor, RedisLimitInterceptor } from './interceptors';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ApiModule } from './api/api.module';
import { ValidationPipe } from './pipe/validation.pipe';
import { PluginModule } from './plugin/plugin.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false, // 忽视默认读取.env的文件配置
      isGlobal: true, // 全局注入
      load: [getConfig], // 加载配置文件
    }),
    // mysql的连接
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: String(configService.get('datasource.host')),
        port: Number.parseInt(configService.get('datasource.port') ?? '3306'),
        username: String(configService.get('datasource.username')),
        password: String(configService.get('datasource.password')),
        database: String(configService.get('datasource.database')),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: configService.get('datasource.logging'),
        timezone: '+08:00', // 东八区
        cache: {
          duration: 60000, // 1分钟的缓存
        },
        extra: {
          poolMax: 32,
          poolMin: 16,
          queueTimeout: 60000,
          pollPingInterval: 60, // 每隔60秒连接
          pollTimeout: 60, // 连接有效60秒
        },
      }),
    }),
    SharedModule,
    PluginModule,
    ApiModule,
  ],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisLimitInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // 全局使用管道(数据校验)
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // 全局使用过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
