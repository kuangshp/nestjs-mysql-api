import { Module } from '@nestjs/common';
// import { MODULE_PATH } from '@nestjs/common/constants'
import { AccountController } from './account/controllers/account/account.controller';
import { AccountService } from './account/services/account/account.service';
import { RoleController } from './role/contorlles/role/role.controller';
import { AccessController } from './access/contorlles/access/access.controller';
import { AccessService } from './access/services/access/access.service';
import { RoleService } from './role/services/role/role.service';

@Module({
  controllers: [AccountController, RoleController, AccessController],
  providers: [AccountService, AccessService, RoleService],
})
export class SystemModule {}
// 路由前缀 作用该模块下全部的控制器
// Reflect.defineMetadata(MODULE_PATH, 'admin', SystemModule);