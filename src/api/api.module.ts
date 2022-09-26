import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';

import { LoginModule } from './login/login.module';
import { MenusModule } from './menus/menus.module';
import { ResourceModule } from './resource/resource.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [LoginModule, AccountModule, MenusModule, ResourceModule, RoleModule],
})
export class ApiModule {}
