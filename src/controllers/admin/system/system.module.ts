import { Module } from '@nestjs/common';
import { ServicesModule } from '@src/services/services.module';
import { RoleController } from './role/role.controller';
import { DictConfigController } from './dict-config/dict-config.controller';
import { AccessController } from './access/access.controller';
import { RoleAccessController } from './role-access/role-access.controller';
import { MenusController } from './menus/menus.controller';
import { LoginController } from './login/login.controller';
import { AccountController } from './account/account.controller';
import { AccountRoleController } from './account-role/account-role.controller';

@Module({
  imports: [
    ServicesModule,
  ],
  controllers: [
    RoleController,
    AccessController,
    RoleAccessController,
    MenusController,
    DictConfigController,
    LoginController,
    AccountController,
    AccountRoleController,
  ],
})
export class SystemModule { }
