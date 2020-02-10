import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis'

import { CacheService } from './cache.service';

@Module({
  imports: [
    RedisModule.register({
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0
    })
  ],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheModule { }
