import { CreateMovementLogDto } from 'src/movement-logs/dto/create-movement-log.dto';
import { UpdateMovementLogDto } from 'src/movement-logs/dto/update-movement-log.dto';

export const defaultMovementLogId = 7;
export const defaultMovementId = 13;
export const defaultMovementLog = {
  sets: 3,
  reps: 12,
  load: 47.5,
  timestamp: Date.parse('2024-04-12T03:24:00'),
};

export const movementLogsServiceMock = {
  create: jest
    .fn()
    .mockImplementation(
      (id: number, createMovementLogDto: CreateMovementLogDto) => {
        return {
          id: defaultMovementLogId,
          movementId: id,
          ...createMovementLogDto,
        };
      },
    ),
  findOne: jest.fn().mockImplementation((id: number) => {
    return {
      id,
      movementId: defaultMovementId,
      ...defaultMovementLog,
    };
  }),
  findAll: jest.fn().mockImplementation((movementId: number) => {
    return [
      {
        id: defaultMovementLogId,
        movementId: movementId,
        ...defaultMovementLog,
      },
    ];
  }),
  update: jest
    .fn()
    .mockImplementation(
      (id: number, updateMovementLogDto: UpdateMovementLogDto) => {
        return {
          id,
          movementId: defaultMovementId,
          ...defaultMovementLog,
          ...updateMovementLogDto, // overrides any value in kMovementLog, if the value is set in the update DTO.
        };
      },
    ),
  remove: jest.fn().mockImplementation((id: number) => {
    return {
      id,
      movementId: defaultMovementId,
      ...defaultMovementLog,
    };
  }),
};
