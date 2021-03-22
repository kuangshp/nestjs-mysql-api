import { Module } from '@nestjs/common';
import { MODULE_PATH } from '@nestjs/common/constants'
import { AccountController } from './account/controllers/account/account.controller';
import { AccountService } from './account/services/account/account.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
})
export class SystemModule {}
// 路由前缀 作用该模块下全部的控制器
Reflect.defineMetadata(MODULE_PATH, 'admin', SystemModule);