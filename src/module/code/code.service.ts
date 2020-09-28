import { Injectable } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';

@Injectable()
export class CodeService {
  /**
   * @Author: 水痕
   * @Date: 2020-01-07 16:56:15
   * @LastEditors: 水痕
   * @Description: 生产图形验证码的方法
   * @param {type} 
   * @return: 
   */
  getCaptcha(): { data: any, text: string } {
    const captcha: { data: any, text: string } = svgCaptcha.create({
      size: 1,
      fontSize: 50,
      width: 100,
      height: 34,
      background: "#01458E"
    });
    return captcha;
  }

  /** 
   * 使用方式一、控制器中发送验证码
   *  1.获取验证码
   *  let svgCaptcha = xx.getCaptcha();
   *  2.设置session(或者redis存储中)
   *  req.session.code = svgCaptcha.text;
   *  3.设置响应类型
   *  res.type('image/svg+xml');
   *  4.发送
   *  res.send(svgCaptcha.data);
  */
}
