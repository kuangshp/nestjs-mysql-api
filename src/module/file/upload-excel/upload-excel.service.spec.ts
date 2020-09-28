import { Test, TestingModule } from '@nestjs/testing';
import { UploadExcelService } from './upload-excel.service';

describe('UploadExcelService', () => {
  let service: UploadExcelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadExcelService],
    }).compile();

    service = module.get<UploadExcelService>(UploadExcelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
