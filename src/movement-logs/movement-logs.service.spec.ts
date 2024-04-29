import { Test, TestingModule } from '@nestjs/testing';
import { MovementLogsService } from './movement-logs.service';
import { DatabaseService } from 'src/database/database.service';
import {
  defaultMovementId,
  defaultMovementLog,
  defaultMovementLogId,
} from 'src/testing/movement-logs.service.mock';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.requireActual('prismock').PrismockClient,
  };
});

describe('MovementLogsService', () => {
  let service: MovementLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovementLogsService, DatabaseService],
    }).compile();

    service = module.get<MovementLogsService>(MovementLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and find a movement log', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);

    const createdMovementLog = await service.create(defaultMovementId, {
      ...defaultMovementLog,
    });

    expect(createdMovementLog).toEqual(
      expect.objectContaining(defaultMovementLog),
    );
    expect(createdMovementLog).toHaveProperty('timestamp');

    // Expect service to find created MovementLog.
    await expect(service.findOne(createdMovementLog.id)).resolves.toEqual(
      createdMovementLog,
    );
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(1);
  });

  it('should not find non-existent movement log', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);

    // Expect service to not find any MovementLog.
    await expect(service.findOne(defaultMovementLogId)).rejects.toThrow();
  });

  it('should create multiple movement logs and find all', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);

    const createdMovementLog1 = await service.create(defaultMovementId, {
      ...defaultMovementLog,
    });

    const createdMovementLog2 = await service.create(defaultMovementId, {
      ...defaultMovementLog,
    });

    expect(createdMovementLog1.id).not.toEqual(createdMovementLog2.id);

    // Expect service to find created MovementLog.
    await expect(service.findAll(defaultMovementId)).resolves.toEqual([
      createdMovementLog1,
      createdMovementLog2,
    ]);
  });

  it('should update a movement log', async () => {
    const newReps = 13;

    // Expect initial empty state.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);

    const createdMovementLog = await service.create(defaultMovementId, {
      ...defaultMovementLog,
    });

    const updatedMovementLog = await service.update(createdMovementLog.id, {
      reps: newReps,
    });

    expect(updatedMovementLog).toEqual(
      expect.objectContaining({
        id: createdMovementLog.id,
        ...defaultMovementLog,
        reps: newReps,
      }),
    );

    // Expect service to find updated MovementLog.
    await expect(service.findOne(createdMovementLog.id)).resolves.toEqual({
      ...createdMovementLog,
      reps: newReps,
    });
  });

  it('should not update non-existing movement log', async () => {
    const newReps = 13;

    // Expect initial empty state.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);

    // Updating a MovementLog that should not exist.
    await expect(
      service.update(defaultMovementLogId, {
        reps: newReps,
      }),
    ).resolves.toBeNull(); // The real implementation would throw an error.

    // Expect empty state again.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);
  });

  it('should delete a movement log.', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);

    const createdMovementLog = await service.create(defaultMovementId, {
      ...defaultMovementLog,
    });

    // Expect service to deleted created MovementLog.
    await expect(service.remove(createdMovementLog.id)).resolves.toEqual(
      createdMovementLog,
    );

    // Expect empty state again.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);
  });

  it('should not delete a non-existing movement log.', async () => {
    // Expect initial empty state.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);

    // Expect service to deleted created MovementLog.
    await expect(service.remove(defaultMovementLogId)).rejects.toThrow();

    // Expect empty state again.
    await expect(service.findAll(defaultMovementId)).resolves.toHaveLength(0);
  });
});
