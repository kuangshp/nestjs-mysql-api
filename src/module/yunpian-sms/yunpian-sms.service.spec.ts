import { Test, TestingModule } from '@nestjs/testing';
import { YunpianSmsService } from './yunpian-sms.service';

describe('YunpianSmsService', () => {
  let service: YunpianSmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YunpianSmsService],
    }).compile();

    service = module.get<YunpianSmsService>(YunpianSmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
