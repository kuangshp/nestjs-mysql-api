import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common/enums';
import { Logger } from '@nestjs/common/services';

import { AppModule } from './app.module';
import { getConfig, IS_DEV } from './utils';

export const config = getConfig();
const PORT = config.PORT || 8080;
const PREFIX = config.PREFIX || '/';

async function bootstrap() {
  const logger: Logger = new Logger('main.ts');
  const app = await NestFactory.create(AppModule, {
    // 开启日志级别打印
    logger: IS_DEV ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn'],
  });
  //允许跨域请求
  app.enableCors();

  // 启动版本管理
  app.enableVersioning({
    defaultVersion: '1', // 不指定默认版本为v1
    type: VersioningType.URI,
  });

  // 给请求添加prefix
  app.setGlobalPrefix(PREFIX);
  await app.listen(PORT, () => {
    logger.log(`服务已经启动,接口请访问:http://wwww.localhost:${PORT}/${PREFIX}`);
  });
}
bootstrap();
