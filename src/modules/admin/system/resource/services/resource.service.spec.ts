import { Test, TestingModule } from '@nestjs/testing';
import { ResourceService } from './resource.service';

describe('ResourceService', () => {
  let service: ResourceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourceService],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
