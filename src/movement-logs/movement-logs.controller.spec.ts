import { Test, TestingModule } from '@nestjs/testing';
import { MovementLogsController } from './movement-logs.controller';
import { MovementLogsService } from './movement-logs.service';

describe('MovementLogsController', () => {
  let controller: MovementLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementLogsController],
      providers: [MovementLogsService],
    }).compile();

    controller = module.get<MovementLogsController>(MovementLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
