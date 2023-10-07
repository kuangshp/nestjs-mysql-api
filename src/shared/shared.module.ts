import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from '@src/api/account/entities/account.entity';
import { TenantEntity } from '@src/api/tenant/entities/tenant.entity';
import { InitDbService } from './services/init-db.service';

@Global()
@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([AccountEntity, TenantEntity])],
  providers: [InitDbService],
})
export class SharedModule {}
