import { Module } from '@nestjs/common';
import { CodeService } from './code.service';

@Module({
  providers: [CodeService]
})
export class CodeModule {}
