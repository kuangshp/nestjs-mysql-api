import * as path from 'path';

import { Injectable, HttpException, HttpStatus, Optional } from '@nestjs/common';

import moment from 'moment';
const OSS = require('ali-oss'); // eslint-disable-line
import { ConfigService } from '@nestjs/config';

// 定义上传文件参数类型
interface UploadFileType {
  files: any; // 文件名
  category?: string; // 分类
  typeList?: string[]; // 约束类型
}
// 定义返回类型
export interface UploadResultType {
  url: string;
  fileName: string;
}

@Injectable()
export class UploadImgService {
  private client: any;
  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    this.client = new OSS({
      accessKeyId: this.configService.get('aliyunOss.accessKeyId'),
      accessKeySecret: this.configService.get('aliyunOss.accessKeySecret'),
      region: this.configService.get('aliyunOss.endpointUrl'),
      bucket: this.configService.get('aliyunOss.bucketName'),
      secure: true, // 开启https
    });
  }
  /**
   * @Author: 水痕
   * @Date: 2022-09-24 09:30:01
   * @LastEditors:
   * @LastEditTime:
   * @Description: 定义单个文件的上传
   * @param {*} Optional
   * @return {*}
   */
  public async uploadFile(@Optional() options: UploadFileType): Promise<UploadResultType> {
    return await this.process(options);
  }

  /**
   * @Author: 水痕
   * @Date: 2022-09-24 09:29:41
   * @LastEditors:
   * @LastEditTime:
   * @Description: 上传多个文件
   * @param {*} Optional
   * @return {*}
   */
  public async uploadFiles(@Optional() options: UploadFileType): Promise<UploadResultType[]> {
    const filenameList: Array<UploadResultType> = [];
    const { files, category, typeList } = options;
    for (const file of files) {
      const result = await this.process({ files: file, category, typeList });
      filenameList.push(result);
    }
    return filenameList;
  }

  /**
   * @Author: 水痕
   * @Date: 2022-09-24 09:27:15
   * @LastEditors:
   * @LastEditTime:
   * @description: 处理上传文件的过程
   * @return {*}
   */
  private async process(@Optional() options: UploadFileType): Promise<UploadResultType> {
    const { files, category = '', typeList } = options;
    // 现在文件大小
    const fileSize = Number(files.size) / 1000 / 1000;
    const defaultSize = this.configService.get('aliyunOss.imgDefaultSize');
    if (fileSize > defaultSize) {
      throw new HttpException(
        `你上传的文件体积大于 ${defaultSize}M，请先选择在线压缩工具压缩后上传`,
        HttpStatus.OK
      );
    }
    // 文件的扩展名
    const extname = path.extname(files.originalname).toLocaleLowerCase();
    // 文件名
    const filename = `${Date.now()}${Number.parseInt(String(Math.random() * 1000), 10)}${extname}`;
    // 如果有文件格式约束就判断上传文件
    if (
      typeList &&
      typeList.length &&
      !typeList.map((item) => item.toLocaleLowerCase()).includes(extname)
    ) {
      throw new HttpException(
        `上传图片格式限制为:[${typeList}]其中一种,你上传的图片格式里包含了:${extname}`,
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    // 根据格式生成文件夹
    const dirname = moment(Date.now()).format('YYYY/MM/DD');
    const filePath = path.join(category, dirname);
    const target = path.join(filePath, filename);
    const result = await this.client.put(target, files.buffer);
    return { url: result.url, fileName: files.originalname };
  }
}
