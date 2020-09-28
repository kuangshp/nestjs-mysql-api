import { Module } from '@nestjs/common';
import { YunpianSmsService } from './yunpian-sms.service';

@Module({
  providers: [YunpianSmsService],
  exports: [YunpianSmsService]
})
export class YunpianSmsModule { }
