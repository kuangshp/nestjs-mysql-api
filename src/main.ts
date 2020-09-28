import 'dotenv/config';
import * as path from 'path';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as requestIp from 'request-ip';

import adminConfig from './config/admin.config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './interceptors/transform/transform.interceptor';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bodyParser = require('body-parser');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('body-parser-xml')(bodyParser);

const PORT = process.env.PORT || 8080;
const PREFIX = process.env.PREFIX || '';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // 给请求添加prefix
  app.setGlobalPrefix(PREFIX);

  // 配置api文档信息
  const options = new DocumentBuilder()
    .setTitle('nest framework  api文档')
    .setDescription('nest framework  api接口文档')
    .setBasePath(PREFIX)
    .addBearerAuth({ type: 'apiKey', in: 'header', name: 'token' })
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${PREFIX}/docs`, app, document);
  // 访问频率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 500, // 限制15分钟内最多只能访问500次
    }),
  );

  //配置静态资源目录
  app.useStaticAssets(path.join(__dirname, '..', 'public/dancebox-admin'), {
    prefix: adminConfig.staticPrefixPath,
  });

  // Web漏洞的
  app.use(helmet());

  // 全局注册错误的过滤器(错误异常)
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局注册拦截器(成功返回格式)
  app.useGlobalInterceptors(new TransformInterceptor());
  // 获取ip地址
  app.use(requestIp.mw());

  app.use(bodyParser.xml({
    limit: '1MB',   // Reject payload bigger than 1 MB
    xmlParseOptions: {
      normalize: true,     // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false // Only put nodes in array if >1
    }
  }));

  await app.listen(PORT, () => {
    Logger.log(`服务已经启动,请访问:http://wwww.localhost:${PORT}/${PREFIX}`);
  });
  // 热更新
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap().catch(e => Logger.error('错误', e));
