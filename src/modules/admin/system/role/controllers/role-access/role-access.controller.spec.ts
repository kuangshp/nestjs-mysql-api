import { Test, TestingModule } from '@nestjs/testing';
import { RoleAccessController } from './role-access.controller';

describe('RoleAccessController', () => {
  let controller: RoleAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleAccessController],
    }).compile();

    controller = module.get<RoleAccessController>(RoleAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
