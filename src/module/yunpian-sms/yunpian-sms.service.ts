import * as https from 'https';
import * as qs from 'querystring';

import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class YunpianSmsService {
  private apikey: string;
  private getUserInfoUri: string;
  private smsHost: string;
  private voiceHost: string;
  private sendSmsUri: string;
  private sendTplSmsUri: string;
  private sendVoiceUri: string;
  constructor () {
    // 修改为您的apikey.可在官网（https://www.yunpian.com)登录后获取
    this.apikey = 'c46f06bee194f3cfd7bab441ce51';
    // 查询账户信息https地址
    this.getUserInfoUri = '/v2/user/get.json';
    // 智能匹配模板发送https地址
    this.smsHost = "sms.yunpian.com"; // 短信
    this.voiceHost = "voice.yunpian.com"; // 语音
    // 发送短信的url地址
    this.sendSmsUri = "/v2/sms/single_send.json";
    // 指定模板发送接口https地址
    this.sendTplSmsUri = "/v2/sms/tpl_single_send.json";
    // 发送语音验证码接口https地址
    this.sendVoiceUri = "/v2/voice/send.json";
  }



  /**
   * @Author: 水痕
   * @Date: 2020-02-20 19:15:22
   * @LastEditors: 水痕
   * @Description: 发送短信验证码
   * @param mobile {string} 手机号码
   * @param code {string} 动态码
   * @return: 
   */
  public sendSms(mobile: string, code: string): void {
    // 查询用户
    this.queryUserInfo();
    const postData = {
      apikey: this.apikey,
      mobile: mobile,
      text: `【xxx】您的验证码是${code}`
    }; //这是需要提交的数据
    const content = qs.stringify(postData);
    Logger.log(content, 'content');
    this.post(this.sendSmsUri, content, this.smsHost);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-20 19:24:05
   * @LastEditors: 水痕
   * @Description: 发送短信模板
   * @param mobile {string} 手机号码
   * @param tplId {number} 模板id
   * @return: 
   */
  public sendTplSms(mobile: string, code: string, tplId: number): void {
    // 查询用户
    this.queryUserInfo();
    const postData = {
      apikey: this.apikey,
      mobile: mobile,
      // eslint-disable-next-line @typescript-eslint/camelcase
      tpl_id: tplId,
      // eslint-disable-next-line @typescript-eslint/camelcase
      tpl_value: qs.stringify({ "#code#": code })
    }; //这是需要提交的数据
    const content = qs.stringify(postData);
    this.post(this.sendTplSmsUri, content, this.smsHost);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-20 19:29:06
   * @LastEditors: 水痕
   * @Description: 发送语言短信
   * @param mobile {string} 手机号码
   * @param code {string} 动态码
   * @return: 
   */
  public sendVoiceSms(mobile: string, code: string): void {
    // 查询用户
    this.queryUserInfo();
    const postData = {
      apikey: this.apikey,
      mobile: mobile,
      code: code
    }; //这是需要提交的数据
    const content = qs.stringify(postData);
    this.post(this.sendVoiceUri, content, this.voiceHost);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-20 19:08:48
   * @LastEditors: 水痕
   * @Description: 查询用户信息
   * @param {type} 
   * @return: 
   */
  private queryUserInfo(): void {
    const postData = {
      apikey: this.apikey
    }; //这是需要提交的数据
    const content = qs.stringify(postData);
    this.post(this.getUserInfoUri, content, this.smsHost);
  }

  /**
   * @Author: 水痕
   * @Date: 2020-02-20 19:13:13
   * @LastEditors: 水痕
   * @Description: 提交发送
   * @param {type} 
   * @return: 
   */
  private post(uri: string, content: string, host: string): void {
    const options = {
      hostname: host,
      port: 443,
      path: uri,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    };
    const req = https.request(options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        console.log("BODY: " + chunk);
      });
    });
    req.write(content);

    req.end();
  }
}
