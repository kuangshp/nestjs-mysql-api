import { Test, TestingModule } from '@nestjs/testing';
import { CartGateway } from './cart.gateway';

describe('CartGateway', () => {
  let gateway: CartGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartGateway],
    }).compile();

    gateway = module.get<CartGateway>(CartGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
