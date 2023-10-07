import { Module } from '@nestjs/common';
import { TenantModule } from './tenant/tenant.module';
import { AreaModule } from './area/area.module';
import { AccountModule } from './account/account.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [TenantModule, AreaModule, AccountModule, RoleModule],
})
export class ApiModule {}
