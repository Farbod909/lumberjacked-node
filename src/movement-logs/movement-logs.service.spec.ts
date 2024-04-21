import { Test, TestingModule } from '@nestjs/testing';
import { MovementLogsService } from './movement-logs.service';

describe('MovementLogsService', () => {
  let service: MovementLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementLogsService],
    }).compile();

    service = module.get<MovementLogsService>(MovementLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
