import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_PREFIX } from '@src/constants';
import { LoginHistoryEntity } from '../login/entities/login.history.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [
    RouterModule.register([
      {
        path: PROJECT_PREFIX, // 指定项目名称
        module: AccountModule,
      },
    ]),
    TypeOrmModule.forFeature([AccountEntity, LoginHistoryEntity]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
