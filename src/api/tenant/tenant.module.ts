import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { AccountEntity } from '../account/entities/account.entity';
import { AreaEntity } from '../area/entities/area.entity';
import { TenantEntity } from './entities/tenant.entity';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: TenantModule,
      },
    ]),
    TypeOrmModule.forFeature([TenantEntity, AreaEntity, AccountEntity]),
  ],
  providers: [TenantService],
  controllers: [TenantController],
})
export class TenantModule {}
