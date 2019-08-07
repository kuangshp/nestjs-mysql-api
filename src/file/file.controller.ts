import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadFileService } from './../core/upload-file/upload-file.service';

@Controller('file')
export class FileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('files'))
  uploadFile(@UploadedFile() files) {
    return this.uploadFileService.uploadFile({
      files,
      typeList: ['.png', '.pdf'],
    });
  }
}
