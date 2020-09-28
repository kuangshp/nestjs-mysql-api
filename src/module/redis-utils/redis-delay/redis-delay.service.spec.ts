import { Test, TestingModule } from '@nestjs/testing';
import { RedisDelayService } from './redis-delay.service';

describe('RedisDelayService', () => {
  let service: RedisDelayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisDelayService],
    }).compile();

    service = module.get<RedisDelayService>(RedisDelayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
