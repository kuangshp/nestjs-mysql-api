import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { PROJECT_PREFIX } from '@src/constants';
import { LoginModule } from '../login/login.module';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: PROJECT_PREFIX, // 指定项目名称
        module: LoginModule,
      },
    ]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
