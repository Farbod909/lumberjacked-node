import { Test, TestingModule } from '@nestjs/testing';
import { MovementsService } from './movements.service';
import { DatabaseService } from 'src/database/database.service';
import {
  defaultMovement,
  defaultMovementId,
  defaultUserId,
} from 'src/testing/movements.service.mock';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.requireActual('prismock').PrismockClient,
  };
});

describe('MovementsService', () => {
  let service: MovementsService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementsService, DatabaseService],
    }).compile();

    service = module.get<MovementsService>(MovementsService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and find a movement log', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);
    const createdMovement = await service.create(
      {
        ...defaultMovement,
      },
      defaultUserId,
    );

    expect(createdMovement).toEqual(expect.objectContaining(defaultMovement));

    // Expect service to find created movement.
    await expect(service.findOne(createdMovement.id)).resolves.toEqual({
      ...createdMovement,
      movementLogs: [],
    });
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(1);
  });

  it('should not find non-existent movement', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);

    // Expect service to not find any movement.
    await expect(service.findOne(defaultMovementId)).rejects.toThrow();
  });

  it('should create multiple movements and find all', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);

    const createdMovement1 = await service.create(
      {
        ...defaultMovement,
      },
      defaultUserId,
    );

    // Create a few movement logs to ensure that our findAll method is including those.
    // timestamps must be strings because Prismock does not support orderBy on Date objects.
    const createdMovement1Log1 = await databaseService.movementLog.create({
      data: {
        movementId: createdMovement1.id,
        sets: 1,
        reps: 2,
        load: 3,
        timestamp: '2024-01-17T16:45:30',
      },
    });
    const createdMovement1Log2 = await databaseService.movementLog.create({
      data: {
        movementId: createdMovement1.id,
        sets: 4,
        reps: 5,
        load: 6,
        timestamp: '2024-03-17T16:45:30',
      },
    });

    // Make sure that our test data is ordered as expected.
    expect(
      Date.parse(createdMovement1Log1.timestamp.toString()).valueOf(),
    ).toBeLessThan(
      Date.parse(createdMovement1Log2.timestamp.toString()).valueOf(),
    );

    const createdMovement2 = await service.create(
      {
        ...defaultMovement,
      },
      defaultUserId,
    );

    expect(createdMovement1.id).not.toEqual(createdMovement2.id);

    // Expect service to find created movement.
    await expect(service.findAll(defaultUserId)).resolves.toEqual([
      {
        id: createdMovement1.id,
        name: createdMovement1.name,
        split: createdMovement1.split,
        movementLogs: [
          {
            reps: createdMovement1Log2.reps,
            load: createdMovement1Log2.load,
            timestamp: createdMovement1Log2.timestamp,
          },
        ],
      },
      {
        id: createdMovement2.id,
        name: createdMovement2.name,
        split: createdMovement2.split,
        movementLogs: [],
      },
    ]);
  });

  it('should update a movement', async () => {
    const newSplit = 'Upper';

    // Expect initial empty state.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);

    const createdMovement = await service.create(
      {
        ...defaultMovement,
      },
      defaultUserId,
    );

    const updatedMovement = await service.update(createdMovement.id, {
      split: newSplit,
    });

    expect(updatedMovement).toEqual(
      expect.objectContaining({
        id: createdMovement.id,
        ...defaultMovement,
        split: newSplit,
      }),
    );

    // Expect service to find updated movement.
    await expect(service.findOne(createdMovement.id)).resolves.toEqual({
      ...createdMovement,
      split: newSplit,
      movementLogs: [],
    });
  });

  it('should not update non-existing movement', async () => {
    const newSplit = 'Upper';

    // Expect initial empty state.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);

    // Updating a MovementLog that should not exist.
    await expect(
      service.update(defaultMovementId, {
        split: newSplit,
      }),
    ).resolves.toBeNull(); // The real implementation would throw an error.

    // Expect empty state again.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);
  });

  it('should delete a movement log.', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);

    const createdMovement = await service.create(
      {
        ...defaultMovement,
      },
      defaultUserId,
    );

    // Expect service to deleted created MovementLog.
    await expect(service.remove(createdMovement.id)).resolves.toEqual(
      createdMovement,
    );

    // Expect empty state again.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);
  });

  it('should not delete a non-existing movement log.', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);

    // Expect service to deleted created MovementLog.
    await expect(service.remove(defaultMovementId)).rejects.toThrow();

    // Expect empty state again.
    await expect(service.findAll(defaultUserId)).resolves.toHaveLength(0);
  });
});
