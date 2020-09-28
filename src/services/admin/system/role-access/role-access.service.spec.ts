import { Test, TestingModule } from '@nestjs/testing';
import { RoleAccessService } from './role-access.service';

describe('RoleAccessService', () => {
  let service: RoleAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAccessService],
    }).compile();

    service = module.get<RoleAccessService>(RoleAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
