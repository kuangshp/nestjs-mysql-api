import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log('当前环境', process.env.npm_lifecycle_event);
console.log('数据库连接', process.env.DATABASE_MYSQL_HOST)
const buildModal: string = process.env.npm_lifecycle_event || "";
const isDev: boolean = /^start:dev$/.test(buildModal);
console.log(isDev, '===>')
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();
