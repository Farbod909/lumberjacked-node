import { CreateMovementDto } from 'src/movements/dto/create-movement.dto';
import { UpdateMovmenentDto } from 'src/movements/dto/update-movement.dto';

export const defaultMovementId = 42;
export const defaultUserId = 21;
export const defaultMovement = {
  name: 'Bench Press',
  split: 'Chest',
  description: 'Sample description',
  workingSets: '2-3',
};

export const movementsServiceMock = {
  create: jest
    .fn()
    .mockImplementation(
      (createMovementDto: CreateMovementDto, authorId: number) => {
        return {
          id: defaultMovementId,
          authorId: authorId,
          ...createMovementDto,
        };
      },
    ),
  findAll: jest.fn().mockImplementation((authorId: number) => {
    return [
      {
        id: defaultMovementId,
        authorId: authorId,
        ...defaultMovement,
      },
    ];
  }),
  findOne: jest.fn().mockImplementation((id: number) => {
    return {
      id,
      authorId: defaultUserId,
      ...defaultMovement,
    };
  }),
  update: jest
    .fn()
    .mockImplementation((id: number, updateMovementDto: UpdateMovmenentDto) => {
      return {
        id,
        authorId: defaultUserId,
        ...defaultMovement,
        ...updateMovementDto,
      };
    }),
  remove: jest.fn().mockImplementation((id: number) => {
    return {
      id,
      authorId: defaultUserId,
      ...defaultMovement,
    };
  }),
};
