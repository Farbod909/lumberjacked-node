import { Test, TestingModule } from '@nestjs/testing';
import { MovementLogsController } from './movement-logs.controller';
import { MovementLogsService } from './movement-logs.service';
import { UpdateMovementLogDto } from './dto/update-movement-log.dto';

const kMovementLogId = 1;
const kMovementId = 1;
const kMovementLog = {
  sets: 3,
  reps: 12,
  load: 47.5,
  timestamp: Date.parse('2024-04-12T03:24:00'),
};

const mockMovementLogsService = {
  findOne: jest.fn().mockImplementation((id: number) => {
    return {
      id,
      movementId: kMovementId,
      ...kMovementLog,
    };
  }),
  update: jest
    .fn()
    .mockImplementation(
      (movementId: number, updateMovementLogDto: UpdateMovementLogDto) => {
        return {
          id: kMovementLogId,
          movementId,
          ...kMovementLog,
          ...updateMovementLogDto, // overrides any value in kMovementLog, if the value is set in the update DTO.
        };
      },
    ),
  remove: jest.fn().mockImplementation((id: number) => {
    return {
      id,
      movementId: kMovementId,
      ...kMovementLog,
    };
  }),
};

describe('MovementLogsController', () => {
  let controller: MovementLogsController;
  let service: MovementLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementLogsController],
      providers: [MovementLogsService],
    })
      .overrideProvider(MovementLogsService)
      .useValue(mockMovementLogsService)
      .compile();

    controller = module.get<MovementLogsController>(MovementLogsController);
    service = module.get<MovementLogsService>(MovementLogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find a movement log', async () => {
    const expectedMovementLog = {
      id: kMovementLogId,
      movementId: kMovementId,
      ...kMovementLog,
    };
    const resultMovementLog = await controller.findOne(kMovementLogId);

    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(resultMovementLog).toStrictEqual(expectedMovementLog);
  });

  it('should update a movement log', async () => {
    const updateMovementLogDto = {
      sets: 13,
    };
    const expectedMovementLog = Object.assign(
      {
        id: kMovementId,
        movementId: kMovementLogId,
        ...kMovementLog,
      },
      updateMovementLogDto,
    );

    const resultMovementLog = await controller.update(
      kMovementLogId,
      updateMovementLogDto,
    );

    expect(service.update).toHaveBeenCalledTimes(1);
    expect(resultMovementLog).toStrictEqual(expectedMovementLog);
  });

  it('should remove a movement log', async () => {
    const expectedMovementLog = {
      id: kMovementLogId,
      movementId: kMovementId,
      ...kMovementLog,
    };
    const resultMovementLog = await controller.remove(kMovementLogId);

    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(resultMovementLog).toStrictEqual(expectedMovementLog);
  });
});
