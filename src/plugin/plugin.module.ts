import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { ToolsService } from './tools/tools.service';
import { RedisService } from './redis/redis.service';
import { CollectApiModule } from './collect-api/collect-api.module';
import { IpToAddressService } from './ip-to-address/ip-to-address.service';
import { UploadImgService } from './file/upload-img.service';

@Global()
@Module({
  providers: [LoggerService, ToolsService, RedisService, IpToAddressService, UploadImgService],
  exports: [LoggerService, ToolsService, RedisService, IpToAddressService, UploadImgService],
  imports: [CollectApiModule],
})
export class PluginModule {}
