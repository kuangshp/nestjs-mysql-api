import { Controller, UseInterceptors, HttpCode, Post, HttpStatus, UploadedFile, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import adminConfig from '@src/config/admin.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectConfig, ConfigService } from 'nestjs-config';
import { UploadImgService } from '@src/module/file/upload-img/upload-img.service';
import { AuthGuard } from '@src/guard/auth.guard';

@ApiTags('上传文件')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller(`${adminConfig.adminPath}/file`)
export class FileController {
  constructor (
    @InjectConfig() private readonly configService: ConfigService,
    private readonly uploadImgService: UploadImgService,
  ) { }

  @ApiOperation({ summary: '上传图片', description: '上传图片的接口, file:上传的图片, category:分类(可选参数)' })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @Post('upload_image')
  async uploadImage(
    @UploadedFile() file: any,
    @Body('category') category = ''
  ): Promise<any> {
    const supportImgTypes = this.configService.get('admin.supportImgTypes');
    const result = await this.uploadImgService.uploadFile({
      files: file,
      category,
      typeList: supportImgTypes,
      isOSS: true,
    })
    return {
      result,
      isUpload: true,
    };
  }
}
