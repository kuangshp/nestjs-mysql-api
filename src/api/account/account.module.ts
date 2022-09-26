import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_PREFIX } from '@src/constants';
import { LoginModule } from '../login/login.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [
    RouterModule.register([
      {
        path: PROJECT_PREFIX, // 指定项目名称
        module: LoginModule,
      },
    ]),
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
