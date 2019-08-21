import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { ResourceEntity } from './resource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  providers: [ResourceService],
  controllers: [ResourceController],
})
export class ResourceModule {}
