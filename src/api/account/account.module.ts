import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { DepartmentEntity } from '../department/entities/department.entity';
import { TenantEntity } from '../tenant/entities/tenant.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: AccountModule,
      },
    ]),
    TypeOrmModule.forFeature([AccountEntity, TenantEntity, DepartmentEntity]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
