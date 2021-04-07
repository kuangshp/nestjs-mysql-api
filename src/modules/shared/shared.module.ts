import { Module, Global } from '@nestjs/common';
import { ToolsService } from './services/tools/tools.service';
import { InitDbService } from './services/init-db/init-db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../admin/system/account/entities/account.entity';
import { AccessEntity } from '../admin/system/access/entities/access.entity';
import { ApiAuthService } from './services/api-auth/api-auth.service';
import { AccountRoleEntity } from '../admin/system/account/entities/account.role.entity';
import { RoleAccessEntity } from '../admin/system/role/entities/role.access.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, AccessEntity, AccountRoleEntity, RoleAccessEntity]),
  ],
  providers: [ToolsService, InitDbService, ApiAuthService],
  exports: [ToolsService, ApiAuthService],
})
export class SharedModule {}
