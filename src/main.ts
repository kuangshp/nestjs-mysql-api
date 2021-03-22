import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

console.log('当前环境', process.env.npm_lifecycle_event);
console.log('数据库连接', process.env.DATABASE_MYSQL_HOST)
const buildModal: string = process.env.npm_lifecycle_event || "";
const isDev: boolean = /^start:dev$/.test(buildModal);
console.log(isDev, '===>')


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局注册错误的过滤器(错误异常)
  app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(4000);
}
bootstrap();
