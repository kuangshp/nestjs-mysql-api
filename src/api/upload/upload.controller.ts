import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImgService, UploadResultType } from '@src/plugin/file/upload-img.service';
@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadImgService: UploadImgService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileImg(@UploadedFile() file: any): Promise<UploadResultType> {
    return await this.uploadImgService.uploadFile({
      files: file,
      category: 'wechat',
      typeList: this.configService.get('aliyunOss.supportImgTypes'),
    });
  }
}
