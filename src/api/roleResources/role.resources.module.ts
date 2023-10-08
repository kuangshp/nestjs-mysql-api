import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { RoleResourcesEntity } from './entities/role.resources.entity';
import { RoleResourcesController } from './role.resources.controller';
import { RoleResourcesService } from './role.resources.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: RoleResourcesModule,
      },
    ]),
    TypeOrmModule.forFeature([RoleResourcesEntity, ResourcesEntity]),
  ],
  controllers: [RoleResourcesController],
  providers: [RoleResourcesService],
})
export class RoleResourcesModule {}
