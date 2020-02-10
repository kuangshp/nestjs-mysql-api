import { Module } from '@nestjs/common';
import { UploadFileService } from './upload-file/upload-file.service';

@Module({
  providers: [UploadFileService],
  exports: [UploadFileService]
})
export class FileModule { }
