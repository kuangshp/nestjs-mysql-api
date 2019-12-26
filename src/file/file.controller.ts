import {
  Controller,
  Post,
  UseInterceptors,
  HttpStatus,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileService } from './../core/upload-file/upload-file.service';
import { ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiUseTags('file')
@ApiBearerAuth()
@Controller('file')
export class FileController {
  constructor (private readonly uploadFileService: UploadFileService) { }

  @ApiOperation({ title: '上传文件' })
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('files'))
  uploadFile(@UploadedFile() files) {
    console.log(files);
    return this.uploadFileService.uploadFile({
      files,
      typeList: ['.png', '.pdf'],
    });
  }
}
