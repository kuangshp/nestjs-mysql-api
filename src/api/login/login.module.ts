import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PROJECT_PREFIX } from '@src/constants';
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
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
