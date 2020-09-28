import { Test, TestingModule } from '@nestjs/testing';
import { AccessService } from './access.service';

describe('AccessService', () => {
  let service: AccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessService],
    }).compile();

    service = module.get<AccessService>(AccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
