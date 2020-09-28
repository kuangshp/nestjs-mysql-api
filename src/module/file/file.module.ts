import { Module } from '@nestjs/common';
import { UploadImgService } from './upload-img/upload-img.service';
import { UploadExcelService } from './upload-excel/upload-excel.service';

@Module({
  providers: [
    UploadImgService,
    UploadExcelService,
  ],
  exports: [
    UploadImgService,
    UploadExcelService,
  ]
})
export class FileModule { }
