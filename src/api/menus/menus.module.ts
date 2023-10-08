import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { AccountRoleEntity } from '../accountRole/entities/account.role.entity';
import { ResourcesEntity } from '../resources/entities/resources.entity';
import { RoleResourcesEntity } from '../roleResources/entities/role.resources.entity';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: MenusModule,
      },
    ]),
    TypeOrmModule.forFeature([ResourcesEntity, AccountRoleEntity, RoleResourcesEntity]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
