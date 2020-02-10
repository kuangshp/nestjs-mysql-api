import { Test, TestingModule } from '@nestjs/testing';
import { GoodsController } from './goods.controller';

describe('Goods Controller', () => {
  let controller: GoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsController],
    }).compile();

    controller = module.get<GoodsController>(GoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
