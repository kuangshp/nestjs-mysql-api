import { Test, TestingModule } from '@nestjs/testing';
import { UploadImgService } from './upload-img.service'

describe('UploadImgService', () => {
  let service: UploadImgService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadImgService],
    }).compile();

    service = module.get<UploadImgService>(UploadImgService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
