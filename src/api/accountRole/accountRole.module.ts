import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { RoleEntity } from '../role/entities/role.entity';
import { AccountRoleController } from './accountRole.controller';
import { AccountRoleService } from './accountRole.service';
import { AccountRoleEntity } from './entities/account.role.entity';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: AccountRoleModule,
      },
    ]),
    TypeOrmModule.forFeature([AccountRoleEntity, RoleEntity]),
  ],
  controllers: [AccountRoleController],
  providers: [AccountRoleService],
})
export class AccountRoleModule {}
