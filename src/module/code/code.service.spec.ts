import { Test, TestingModule } from '@nestjs/testing';
import { CodeService } from './code.service';

describe('CodeService', () => {
  let service: CodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeService],
    }).compile();

    service = module.get<CodeService>(CodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
