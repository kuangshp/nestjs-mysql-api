import { Test, TestingModule } from '@nestjs/testing';
import { DictConfigService } from './dict-config.service';

describe('DictConfigService', () => {
  let service: DictConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictConfigService],
    }).compile();

    service = module.get<DictConfigService>(DictConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
