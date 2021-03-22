import { Module, Global } from '@nestjs/common';
import { ToolsService } from './services/tools/tools.service';

@Global()
@Module({
  providers: [
    ToolsService
  ],
  exports: [
    ToolsService,
  ]
})
export class SharedModule {}
