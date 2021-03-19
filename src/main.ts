import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log('当前环境', process.env.npm_lifecycle_event);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
