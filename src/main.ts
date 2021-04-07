import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform/transform.interceptor';

console.log('当前环境', process.env.npm_lifecycle_event);

const PORT = process.env.PORT || 8080;
const PREFIX = process.env.PREFIX || '/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //允许跨域请求
  app.enableCors();
  // 给请求添加prefix
  app.setGlobalPrefix(PREFIX);

  // 配置api文档信息(不是生产环境配置文档)
  if (process.env.NODE_ENV != 'production') {
    const options = new DocumentBuilder()
      .setTitle('权限系统管理  api文档')
      .setDescription('权限系统管理  api接口文档')
      .setBasePath(PREFIX)
      .addBearerAuth({ type: 'apiKey', in: 'header', name: 'token' })
      .setVersion('0.0.1')
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${PREFIX}/docs`, app, document);
  }
  // Web漏洞的
  app.use(helmet());

  // 全局注册错误的过滤器(错误异常)
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局注册拦截器(成功返回格式)
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(PORT, () => {
    Logger.log(`服务已经启动,接口请访问:http://wwww.localhost:${PORT}/${PREFIX}`);
    Logger.log(`服务已经启动,文档请访问:http://wwww.localhost:${PORT}/${PREFIX}/docs`);
  });
}
bootstrap();
