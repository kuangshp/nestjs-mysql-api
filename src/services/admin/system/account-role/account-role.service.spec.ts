import { Test, TestingModule } from '@nestjs/testing';
import { AccountRoleService } from './account-role.service';

describe('AccountRoleService', () => {
  let service: AccountRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountRoleService],
    }).compile();

    service = module.get<AccountRoleService>(AccountRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
