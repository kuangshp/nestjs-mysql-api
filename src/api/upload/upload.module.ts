import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { PROJECT_PREFIX } from '@src/constants';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    RouterModule.register([
      {
        path: PROJECT_PREFIX, // 指定项目名称
        module: UploadModule,
      },
    ]),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
