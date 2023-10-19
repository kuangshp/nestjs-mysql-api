import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { AccountEntity } from '../account/entities/account.entity';
import { AccountRoleEntity } from '../accountRole/entities/account.role.entity';
import { MenusRepository } from '../menus/menus.repository';
import { RoleResourcesEntity } from '../roleResources/entities/role.resources.entity';
import { ResourcesEntity } from './entities/resources.entity';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: ResourcesModule,
      },
    ]),
    TypeOrmModule.forFeature([
      ResourcesEntity,
      AccountEntity,
      RoleResourcesEntity,
      AccountRoleEntity,
    ]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService, MenusRepository],
})
export class ResourcesModule {}
