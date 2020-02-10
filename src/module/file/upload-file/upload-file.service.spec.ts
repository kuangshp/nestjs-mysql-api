import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileService } from './upload-file.service';

describe('UploadFileService', () => {
  let service: UploadFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadFileService],
    }).compile();

    service = module.get<UploadFileService>(UploadFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
