import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from 'src/database/database.service';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.requireActual('prismock').PrismockClient,
  };
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, DatabaseService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  async function createDefaultUser() {
    const defaultCreateUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'Testingson',
      password: 'hunter2',
      passwordConfirmation: 'hunter2',
    };

    return service.create(defaultCreateUserDto);
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    // Do not use createDefaultUser, so we can compare property values of createdUser to the DTO.
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'Testingson',
      password: 'hunter2',
      passwordConfirmation: 'hunter2',
    };

    const createdUser = await service.create(createUserDto);

    expect(createdUser).toEqual(
      expect.objectContaining({
        email: createUserDto.email,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      }),
    );
    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('createdAt');
    expect(createdUser).toHaveProperty('hashedPassword');

    const foundUser = await service.getById(createdUser.id);

    expect(foundUser).toEqual(createdUser);
  });

  it('should create user and get by id', async () => {
    const createdUser = await createDefaultUser();
    const foundUser = await service.getById(createdUser.id);

    expect(foundUser).toEqual(createdUser);
  });

  it('should create user and get by email', async () => {
    const createdUser = await createDefaultUser();
    const foundUser = await service.getByEmail(createdUser.email);

    expect(foundUser).toEqual(createdUser);
  });

  it('should create user and update', async () => {
    const createdUser = await createDefaultUser();
    expect(createdUser.updatedAt).toBeNull();

    const updatedUser = await service.update(createdUser.id, {
      lastName: 'Testenheimer',
    });

    // TODO: Ideally we want to test this, but prismock does not support @updatedat tag yet.
    // expect(updatedUser.updatedAt).not.toBeNull();

    expect(updatedUser.lastName).not.toEqual(createdUser.lastName);

    const foundUser = await service.getById(createdUser.id);

    expect(foundUser.lastName).toEqual(updatedUser.lastName);

    // See above comment.
    // expect(foundUser.updatedAt).toEqual(updatedUser.updatedAt);
  });

  it('should create user and remove', async () => {
    const createdUser = await createDefaultUser();

    await service.remove(createdUser.id);

    await expect(service.getById(createdUser.id)).resolves.toBeNull();
  });

  it('should update password successfully', async () => {
    const createdUser = await createDefaultUser();
    const newPassword = 'hunter3';

    await service.updatePassword(createdUser.id, newPassword);

    const foundUser = await service.getById(createdUser.id);

    expect(createdUser.hashedPassword).not.toEqual(foundUser.hashedPassword);
  });
});
