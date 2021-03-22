import { Module } from '@nestjs/common';
// import { MODULE_PATH } from '@nestjs/common/constants'
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AccountEntity,
      AccountLastLoginEntity,
    ])
  ],
  controllers: [
    AccountController, 
    RoleController, 
    AccessController, 
    LoginController
  ],
  providers: [
    AccountService, 
    AccessService, 
    RoleService, 
    LoginService
  ],
})
export class SystemModule {}
// 路由前缀 作用该模块下全部的控制器
// Reflect.defineMetadata(MODULE_PATH, 'admin', SystemModule);