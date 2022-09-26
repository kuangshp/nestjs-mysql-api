import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_PREFIX } from '@src/constants';
import { LoginModule } from '../login/login.module';
import { MenusEntity } from './entities/menus.entity';
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
    TypeOrmModule.forFeature([MenusEntity]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
