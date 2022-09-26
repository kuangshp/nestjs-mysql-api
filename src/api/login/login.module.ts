import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_PREFIX } from '@src/constants';
import { AccountTokenEntity } from './entities/account.token.entity';
import { LoginHistoryEntity } from './entities/login.history.entity';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: PROJECT_PREFIX, // 指定项目名称
        module: LoginModule,
      },
    ]),
    TypeOrmModule.forFeature([AccountTokenEntity, LoginHistoryEntity]),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
