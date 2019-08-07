import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { UploadFileModule } from './../core/upload-file/upload-file.module';

@Module({
  imports: [UploadFileModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
