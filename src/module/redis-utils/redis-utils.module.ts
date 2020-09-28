import { Module, Global } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis'
import { RedisCacheService } from './redis-cache/redis-cache.service';
import { RedisDelayService } from './redis-delay/redis-delay.service';
import { RedisClientService } from './redis-client/redis-client.service';

@Global()
@Module({
  imports: [
    RedisModule.register({
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0
    })
  ],
  providers: [
    RedisCacheService,
    RedisDelayService,
    RedisClientService,
  ],
  exports: [
    RedisCacheService,
    RedisDelayService,
    RedisClientService,
  ]
})
export class RedisUtilsModule { }
