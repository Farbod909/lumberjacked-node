import { Test, TestingModule } from '@nestjs/testing';
import { MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import {
  movementsServiceMock,
  defaultMovement,
  defaultMovementId,
  defaultUserId,
} from 'src/testing/movements.service.mock';
import { MovementLogsService } from 'src/movement-logs/movement-logs.service';
import UserSessionInfo from 'src/authentication/entities/UserSessionInfo';
import {
  defaultMovementLogId,
  movementLogsServiceMock,
  defaultMovementLog,
} from 'src/testing/movement-logs.service.mock';

const defaultUserSessionInfo: UserSessionInfo = {
  id: defaultUserId,
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
};

describe('MovementsController', () => {
  let controller: MovementsController;
  let movementsService: MovementsService;
  let movementLogsService: MovementLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovementsController],
      providers: [MovementsService, MovementLogsService],
    })
      .overrideProvider(MovementsService)
      .useValue(movementsServiceMock)
      .overrideProvider(MovementLogsService)
      .useValue(movementLogsServiceMock)
      .compile();

    controller = module.get<MovementsController>(MovementsController);
    movementsService = module.get<MovementsService>(MovementsService);
    movementLogsService = module.get<MovementLogsService>(MovementLogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a movement', async () => {
    const createMovementDto = {
      name: 'Weighted Pullup',
      category: 'Back',
      warmupSets: '1',
      restTime: 120,
    };
    const expectedMovement = {
      id: defaultMovementId,
      authorId: defaultUserSessionInfo.id,
      ...createMovementDto,
    };

    const resultMovement = await controller.create(
      defaultUserSessionInfo,
      createMovementDto,
    );

    expect(movementsService.create).toHaveBeenCalledTimes(1);
    expect(resultMovement).toStrictEqual(expectedMovement);
  });

  it('should find all movements', async () => {
    const expectedMovement = {
      id: defaultMovementId,
      authorId: defaultUserSessionInfo.id,
      ...defaultMovement,
    };

    const resultMovements = await controller.findAll(defaultUserSessionInfo);

    expect(movementsService.findAll).toHaveBeenCalledTimes(1);
    expect(resultMovements).toEqual(
      expect.arrayContaining([expect.objectContaining(expectedMovement)]),
    );
  });

  it('should find a movement', async () => {
    const expectedMovement = {
      id: defaultMovementId,
      authorId: defaultUserId,
      ...defaultMovement,
    };

    const resultMovement = await controller.findOne(defaultMovementId);

    expect(movementsService.findOne).toHaveBeenCalledTimes(1);
    expect(resultMovement).toEqual(expectedMovement);
  });

  it('should update a movement', async () => {
    const updateMovementDto = {
      category: 'Upper',
    };
    const expectedMovement = Object.assign(
      {
        id: defaultMovementId,
        authorId: defaultUserId,
        ...defaultMovement,
      },
      updateMovementDto,
    );

    const resultMovement = await controller.update(
      defaultMovementId,
      updateMovementDto,
    );

    expect(movementsService.update).toHaveBeenCalledTimes(1);
    expect(resultMovement).toStrictEqual(expectedMovement);
  });

  it('should delete a movement', async () => {
    const expectedMovement = {
      id: defaultMovementId,
      authorId: defaultUserId,
      ...defaultMovement,
    };

    const resultMovement = await controller.remove(defaultMovementId);

    expect(movementsService.remove).toHaveBeenCalledTimes(1);
    expect(resultMovement).toEqual(expectedMovement);
  });

  it('should create a movement log of a movement', async () => {
    const createMovementLogDto = {
      sets: 4,
      reps: 8,
      load: 87.5,
    };
    const expectedMovementLog = {
      id: defaultMovementLogId,
      movementId: defaultMovementId,
      ...createMovementLogDto,
    };
    const resultMovementLog = await controller.createMovementLog(
      defaultMovementId,
      createMovementLogDto,
    );

    expect(movementLogsService.create).toHaveBeenCalledTimes(1);
    expect(resultMovementLog).toEqual(expectedMovementLog);
  });

  it('should find all movement logs of a movement', async () => {
    const expectedMovementLog = {
      id: defaultMovementLogId,
      movementId: defaultMovementId,
      ...defaultMovementLog,
    };
    const resultMovementLogs =
      await controller.findAllMovementLogs(defaultMovementId);

    expect(movementLogsService.findAll).toHaveBeenCalledTimes(1);
    expect(resultMovementLogs).toEqual(
      expect.arrayContaining([expectedMovementLog]),
    );
  });
});
