import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { UserModule } from './core/user/user.module';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
import { AuthGuard } from './shared/guard/auth.guard';
import { CurlModule } from './core/curl/curl.module';
import { UploadFileModule } from './core/upload-file/upload-file.module';
import { FileModule } from './file/file.module';
import { RoleModule } from './core/role/role.module';
import { ResourceModule } from './core/resource/resource.module';
import * as path from 'path';

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
    UserModule,
    ConfigModule,
    CurlModule,
    UploadFileModule,
    FileModule,
    RoleModule,
    ResourceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
