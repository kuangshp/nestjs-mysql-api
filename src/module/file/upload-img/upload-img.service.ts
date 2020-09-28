import 'dotenv/config';
import { createWriteStream } from 'fs';
import * as path from 'path';
import * as fs from 'fs';

import { Injectable, HttpException, HttpStatus, Optional, Logger } from '@nestjs/common';
import { InjectConfig, ConfigService } from 'nestjs-config';

import * as moment from 'moment';
import * as Jimp from 'jimp';
// import OSS = require('ali-oss');
import * as OSS from 'ali-oss';
import * as co from 'co';

// 定义上传文件参数类型
// eslint-disable-next-line @typescript-eslint/class-name-casing
interface uploadFileType {
  files: any, // 文件名
  category?: string, // 分类
  typeList?: string[], // 约束类型
  isCut?: boolean, // 是否切割
  isOSS?: boolean, // 是否存储到阿里云OSS存储
}
// 定义返回类型
// eslint-disable-next-line @typescript-eslint/class-name-casing
interface uploadResultType {
  url: string,
  fileName: string
}

const client = new OSS({
  accessKeyId: process.env.ALI_OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_OSS_ACCESS_KEY_SECRET,
  region: process.env.ALI_OSS_REGION,
});

@Injectable()
export class UploadImgService {
  constructor (
    @InjectConfig() private readonly configService: ConfigService,
  ) { }

  /**
   * @Author: 水痕
   * @Date: 2020-01-15 09:56:46
   * @LastEditors: 水痕
   * @Description: 定义单个文件的上传
   * @param files {String} 上传的文件
   * @param category {String} 上传文件分类,会自动创建文件夹
   * @param typeList {String[]} 上传文件限制的图片格式
   * @return: { url: string; fileName: string }
   */
  public async uploadFile(@Optional() options: uploadFileType): Promise<any> {
    return await this.process(options);
  }

	/**
   * @Author: 水痕
   * @Date: 2020-01-15 09:54:12
   * @LastEditors: 水痕
   * @Description: 上传多个文件
   * @param files {String} 上传的文件
   * @param category {String} 上传文件的分类,会自动创建文件夹
   * @param typeList {String[]} 上传文件限制的图片格式
   * @return: Array<{ url: string; fileName: string }>
   */
  public async uploadFiles(@Optional() options: uploadFileType): Promise<any> {
    const filenameList: Array<uploadResultType> = [];
    const { files, category, typeList, isCut, isOSS } = options;
    for (const file of files) {
      const result = await this.process({ files: file, category, typeList, isCut, isOSS });
      filenameList.push(result);
    }
    return filenameList;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-11 09:36:44
   * @LastEditors: 水痕
   * @Description: 处理上传文件的过程
   * @param {type} 
   * @return: 
   */
  private async process(@Optional() options: uploadFileType): Promise<any> {
    const { files, category, typeList, isCut, isOSS } = options;

    // 文件的扩展名
    const extname = path.extname(files.originalname).toLocaleLowerCase();
    // 文件名
    const filename = `${Date.now()}${Number.parseInt(String(Math.random() * 1000), 10)}${extname}`;
    // 如果有文件格式约束就判断上传文件
    if (typeList && typeList.length && !typeList.map(item => item.toLocaleLowerCase()).includes(extname)) {
      throw new HttpException(`上传图片格式限制为:[${typeList}]其中一种,你上传的图片格式里包含了:${extname}`, HttpStatus.NOT_ACCEPTABLE);
    }

    // 判断是否进行阿里oss存储
    if (isOSS) {
      // 根据格式生成文件夹
      const dirname = moment(Date.now()).format('YYYY/MM/DD');
      const filePath = path.join(category, dirname);
      const target = path.join(filePath, filename);
      return await co(function* () {
        client.useBucket(process.env.ALI_OSS_BUCKET); //自定义项
        const result = yield client.put(target, files.buffer);
        Logger.log(result.url, 'UploadImgService.process')
        return { url: result.url, fileName: files.originalname };
      }).catch((err: any) => {
        Logger.error(err, 'UploadImgService.process');
        throw new HttpException(err, HttpStatus.OK);
      });
    } else {
      const filePath: string = this.fileDirname(category);
      const target = path.join(filePath, filename);
      const writeImage = createWriteStream(target);
      writeImage.write(files.buffer);
      // 判断是否使用图片缩小及加水印的方法
      if (isCut) {
        this.jimpImg(target, extname);
      }
      const staticPrefixPath = this.configService.get('admin.staticPrefixPath');
      const urlPath = staticPrefixPath ? target.replace('public', `/${staticPrefixPath}`) : '';
      return { url: target.replace('public', urlPath), fileName: files.originalname };
    }
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-12 10:08:03
   * @LastEditors: 水痕
   * @Description: 使用jimp插件对图片进行处理
   * @param {type} 
   * @return: 
   */
  private jimpImg(target: string, fileExtname: string): void {
    const jimpSizeList = this.configService.get('admin.jimpSize');
    // 生成不同规格的图片
    Jimp.read(target, (err, image) => {
      if (err) {
        console.log(err);
      } else {
        for (const item of jimpSizeList) {
          image
            .resize(Number.parseInt(item.width), Number.parseInt(item.height)) // resize
            .quality(100) // set JPEG quality
            // .greyscale() // set greyscale
            .write(`${target}_${item.width}x${item.height}${fileExtname}`); // save
        }
      }
    });
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-15 10:18:09
   * @LastEditors: 水痕
   * @Description: 创建目录
   * @param category {String}
   * @return: 
   */
  private fileDirname(category: string): string {
    // 基础的目录
    const uplaodBasePath = 'public/uploads';
    // 根据格式生成文件夹
    const dirname = moment(Date.now()).format('YYYY/MM/DD');
    const filePath = path.join(uplaodBasePath, category, dirname)
    // 递归创建文件夹
    this.mkdirsSync(filePath);
    return filePath;
  }

  /**
   * @Author: 水痕
   * @Date: 2020-01-11 09:37:05
   * @LastEditors: 水痕
   * @Description: 递归创建文件夹
   * @param {type} 
   * @return: 
   */
  private mkdirsSync(dirname: string): boolean {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
}
