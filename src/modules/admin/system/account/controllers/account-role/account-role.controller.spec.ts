import { Test, TestingModule } from '@nestjs/testing';
import { AccountRoleController } from './account-role.controller';

describe('AccountRoleController', () => {
  let controller: AccountRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountRoleController],
    }).compile();

    controller = module.get<AccountRoleController>(AccountRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
