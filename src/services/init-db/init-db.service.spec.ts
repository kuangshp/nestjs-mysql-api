import { Test, TestingModule } from '@nestjs/testing';
import { InitDbService } from './init-db.service';

describe('InitDbService', () => {
  let service: InitDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitDbService],
    }).compile();

    service = module.get<InitDbService>(InitDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
