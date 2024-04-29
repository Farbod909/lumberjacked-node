import { Test, TestingModule } from '@nestjs/testing';
import { MovementLogsController } from './movement-logs.controller';
import { MovementLogsService } from './movement-logs.service';
import {
  movementLogsServiceMock,
  defaultMovementLogId,
  defaultMovementId,
  defaultMovementLog,
} from 'src/testing/movement-logs.service.mock';

describe('MovementLogsController', () => {
  let controller: MovementLogsController;
  let service: MovementLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementLogsController],
      providers: [MovementLogsService],
    })
      .overrideProvider(MovementLogsService)
      .useValue(movementLogsServiceMock)
      .compile();

    controller = module.get<MovementLogsController>(MovementLogsController);
    service = module.get<MovementLogsService>(MovementLogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find a movement log', async () => {
    const expectedMovementLog = {
      id: defaultMovementLogId,
      movementId: defaultMovementId,
      ...defaultMovementLog,
    };

    const resultMovementLog = await controller.findOne(defaultMovementLogId);

    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(resultMovementLog).toStrictEqual(expectedMovementLog);
  });

  it('should update a movement log', async () => {
    const updateMovementLogDto = {
      sets: 13,
    };
    const expectedMovementLog = Object.assign(
      {
        id: defaultMovementLogId,
        movementId: defaultMovementId,
        ...defaultMovementLog,
      },
      updateMovementLogDto,
    );

    const resultMovementLog = await controller.update(
      defaultMovementLogId,
      updateMovementLogDto,
    );

    expect(service.update).toHaveBeenCalledTimes(1);
    expect(resultMovementLog).toStrictEqual(expectedMovementLog);
  });

  it('should delete a movement log', async () => {
    const expectedMovementLog = {
      id: defaultMovementLogId,
      movementId: defaultMovementId,
      ...defaultMovementLog,
    };

    const resultMovementLog = await controller.remove(defaultMovementLogId);

    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(resultMovementLog).toStrictEqual(expectedMovementLog);
  });
});
