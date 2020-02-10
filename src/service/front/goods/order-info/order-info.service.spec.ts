import { Test, TestingModule } from '@nestjs/testing';
import { OrderInfoService } from './order-info.service';

describe('OrderInfoService', () => {
  let service: OrderInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderInfoService],
    }).compile();

    service = module.get<OrderInfoService>(OrderInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
