import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ADMIN_PREFIX } from '@src/constants';
import { AreaController } from './area.controller';
import { AreaRepository } from './area.repository';
import { AreaService } from './area.service';
import { AreaEntity } from './entities/area.entity';

@Module({
  imports: [
    RouterModule.register([
      {
        path: ADMIN_PREFIX, // 指定项目名称
        module: AreaModule,
      },
    ]),
    TypeOrmModule.forFeature([AreaEntity]),
  ],
  controllers: [AreaController],
  providers: [AreaRepository, AreaService],
})
export class AreaModule {}
