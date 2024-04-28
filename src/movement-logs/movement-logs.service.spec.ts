import { Test, TestingModule } from '@nestjs/testing';
import { MovementLogsService } from './movement-logs.service';
import { DatabaseService } from 'src/database/database.service';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.requireActual('prismock').PrismockClient,
  };
});

const kMovementLogId = 1;
const kMovementId = 1;
const kMovementLog = {
  sets: 3,
  reps: 12,
  load: 47.5,
};

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
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);

    const createdMovementLog = await service.create(kMovementId, {
      ...kMovementLog,
    });

    expect(createdMovementLog).toEqual(expect.objectContaining(kMovementLog));
    expect(createdMovementLog).toHaveProperty('timestamp');

    // Expect service to find created MovementLog.
    await expect(service.findOne(createdMovementLog.id)).resolves.toEqual(
      createdMovementLog,
    );

    await expect(service.findAll(kMovementId)).resolves.toHaveLength(1);
  });

  it('should not find non-existent movement log', async () => {
    // Expect initial empty state.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);

    // Expect service to not find any MovementLog.
    await expect(service.findOne(kMovementLogId)).rejects.toThrow();
  });

  it('should create multiple movement logs and find all', async () => {
    // Expect initial empty state.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);

    const createdMovementLog1 = await service.create(kMovementId, {
      ...kMovementLog,
    });

    const createdMovementLog2 = await service.create(kMovementId, {
      ...kMovementLog,
    });

    expect(createdMovementLog1.id).not.toEqual(createdMovementLog2.id);

    // Expect service to find created MovementLog.
    await expect(service.findAll(kMovementId)).resolves.toEqual([
      createdMovementLog1,
      createdMovementLog2,
    ]);
  });

  it('should update a movement log', async () => {
    const newReps = 13;

    // Expect initial empty state.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);

    const createdMovementLog = await service.create(kMovementId, {
      ...kMovementLog,
    });

    const updatedMovementLog = await service.update(createdMovementLog.id, {
      reps: newReps,
    });

    expect(updatedMovementLog).toEqual(
      expect.objectContaining({
        id: createdMovementLog.id,
        ...kMovementLog,
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
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);

    // Updating a MovementLog that should not exist.
    await expect(
      service.update(kMovementLogId, {
        reps: newReps,
      }),
    ).resolves.toBeNull(); // The real implementation would throw an error.

    // Expect empty state again.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);
  });

  it('should delete a movement log.', async () => {
    // Expect initial empty state.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);

    const createdMovementLog = await service.create(kMovementId, {
      ...kMovementLog,
    });

    // Expect service to deleted created MovementLog.
    await expect(service.remove(createdMovementLog.id)).resolves.toEqual(
      createdMovementLog,
    );

    // Expect empty state again.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);
  });

  it('should not delete a non-existing movement log.', async () => {
    // Expect initial empty state.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);

    // Expect service to deleted created MovementLog.
    await expect(service.remove(kMovementLogId)).rejects.toThrow();

    // Expect empty state again.
    await expect(service.findAll(kMovementId)).resolves.toHaveLength(0);
  });
});
