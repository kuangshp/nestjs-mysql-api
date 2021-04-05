import { Module, Global } from '@nestjs/common';
import { ToolsService } from './services/tools/tools.service';
import { InitDbService } from './services/init-db/init-db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '../admin/system/account/entities/account.entity';
import { AccessEntity } from '../admin/system/access/entities/access.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity, AccessEntity])],
  providers: [ToolsService, InitDbService],
  exports: [ToolsService],
})
export class SharedModule {}
