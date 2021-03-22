import { Test, TestingModule } from '@nestjs/testing';
import { ToolsService } from './tools.service';

describe('ToolsService', () => {
  let service: ToolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolsService],
    }).compile();

    service = module.get<ToolsService>(ToolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
