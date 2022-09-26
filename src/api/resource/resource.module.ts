import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_PREFIX } from '@src/constants';
import { LoginModule } from '../login/login.module';
import { ResourceEntity } from './entities/resource.entity';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: PROJECT_PREFIX, // 指定项目名称
        module: LoginModule,
      },
    ]),
    TypeOrmModule.forFeature([ResourceEntity]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
