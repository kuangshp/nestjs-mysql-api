import { Test, TestingModule } from '@nestjs/testing';
import { GoodsService } from './goods.service';

describe('GoodsService', () => {
  let service: GoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodsService],
    }).compile();

    service = module.get<GoodsService>(GoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
