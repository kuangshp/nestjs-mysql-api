import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PROJECT_PREFIX } from '@src/constants';
import { RoleEntity } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: PROJECT_PREFIX, // 指定项目名称
        module: RoleModule,
      },
    ]),
    TypeOrmModule.forFeature([RoleEntity]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
