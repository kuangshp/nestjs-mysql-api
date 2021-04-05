import { Test, TestingModule } from '@nestjs/testing';
import { IpToAddressService } from './ip-to-address.service';

describe('IpToAddressService', () => {
  let service: IpToAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IpToAddressService],
    }).compile();

    service = module.get<IpToAddressService>(IpToAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
