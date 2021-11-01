import { Module } from '@nestjs/common';
import { AccountController } from './account/controllers/account/account.controller';
import { AccountService } from './account/services/account/account.service';
import { RoleController } from './role/controllers/role/role.controller';
import { AccessController } from './access/controllers/access/access.controller';
import { AccessService } from './access/services/access/access.service';
import { RoleService } from './role/services/role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './account/entities/account.entity';
import { AccountLastLoginEntity } from './account/entities/account.last.login.entity';
import { LoginController } from './account/controllers/login/login.controller';
import { LoginService } from './account/services/login/login.service';
import { RoleEntity } from './role/entities/role.entity';
import { AccountRoleController } from './account/controllers/account-role/account-role.controller';
import { AccountRoleService } from './account/services/account-role/account-role.service';
import { AccountRoleEntity } from './account/entities/account.role.entity';
import { AccessEntity } from './access/entities/access.entity';
import { MenusController } from './access/controllers/menus/menus.controller';
import { MenusService } from './access/services/menus/menus.service';
import { RoleAccessEntity } from './role/entities/role.access.entity';
import { RoleAccessController } from './role/controllers/role-access/role-access.controller';
import { RoleAccessService } from './role/services/role-access/role-access.service';
import { RouterModule } from '@nestjs/core';
import { AccountTokenEntity } from './account/entities/account.token.entity';
import { ResourceService } from './resource/services/resource.service';
import { ResourceEntity } from './resource/entities/resource.entity';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'admin',
        module: SystemModule,
      },
    ]),
    TypeOrmModule.forFeature([
      AccountEntity,
      AccountLastLoginEntity,
      AccountRoleEntity,
      RoleEntity,
      AccessEntity,
      RoleAccessEntity,
      AccountTokenEntity,
      ResourceEntity,
    ]),
  ],
  controllers: [
    AccountController,
    RoleController,
    AccessController,
    LoginController,
    AccountRoleController,
    MenusController,
    RoleAccessController,
  ],
  providers: [
    AccountService,
    AccessService,
    RoleService,
    LoginService,
    AccountRoleService,
    MenusService,
    RoleAccessService,
    ResourceService,
  ],
})
export class SystemModule {}
