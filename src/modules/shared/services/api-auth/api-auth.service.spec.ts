import { Test, TestingModule } from '@nestjs/testing';
import { ApiAuthService } from './api-auth.service';

describe('ApiAuthService', () => {
  let service: ApiAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiAuthService],
    }).compile();

    service = module.get<ApiAuthService>(ApiAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
