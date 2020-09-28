import { Test, TestingModule } from '@nestjs/testing';
import { DictConfigController } from './dict-config.controller';

describe('DictConfig Controller', () => {
  let controller: DictConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictConfigController],
    }).compile();

    controller = module.get<DictConfigController>(DictConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
