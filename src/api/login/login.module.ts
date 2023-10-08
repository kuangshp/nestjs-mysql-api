import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { AccountEntity } from '../account/entities/account.entity';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: LoginModule,
      },
    ]),
    TypeOrmModule.forFeature([AccountEntity]),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
