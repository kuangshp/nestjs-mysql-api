import { Module } from '@nestjs/common';
import { ToolsService } from './tools/tools.service';
import { EntityModule } from '@src/entities/entities.module';
import { RoleService } from './admin/system/role/role.service';
import { AccessService } from './admin/system/access/access.service';
import { LoginService } from './admin/login/login.service';
import { RoleAccessService } from './admin/system/role-access/role-access.service';
import { MenusService } from './admin/system/menus/menus.service';
import { DictConfigService } from './admin/system/dict-config/dict-config.service';
import { AccountService } from './admin/system/account/account.service';
import { AccountRoleService } from './admin/system/account-role/account-role.service';
import { InitDbService } from './init-db/init-db.service';

const serviceList = [
  AccountService,
  AccountRoleService,
  ToolsService,
  RoleService,
  AccessService,
  LoginService,
  RoleAccessService,
  MenusService,
  DictConfigService,
];
@Module({
  imports: [
    EntityModule,
  ],
  providers: [
    ...serviceList,
    InitDbService,
  ],
  exports: [
    ...serviceList,
  ]
})
export class ServicesModule { }
