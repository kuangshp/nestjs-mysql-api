import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/tenant.module';
import { AreaModule } from './area/area.module';
import { AccountModule } from './account/account.module';
import { RoleModule } from './role/role.module';
import { AccountRoleModule } from './accountRole/accountRole.module';
import { LoginModule } from './login/login.module';
import { MenusModule } from './menus/menus.module';
import { ResourcesModule } from './resources/resources.module';
import { RoleResourcesModule } from './roleResources/role.resources.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    TenantModule,
    AreaModule,
    AccountModule,
    RoleModule,
    AccountRoleModule,
    LoginModule,
    MenusModule,
    ResourcesModule,
    RoleResourcesModule,
    DepartmentModule,
  ],
})
export class ApiModule {}
