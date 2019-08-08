import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';

@Module({
  providers: [ResourceService],
  controllers: [ResourceController]
})
export class ResourceModule {}
