import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';
import { DatabaseService } from 'src/database/database.service';
import { defaultUser } from 'src/testing/users.service.mock';
import { AuthorizationResourceType } from './authorization.guard';
import { defaultMovement } from 'src/testing/movements.service.mock';
import { defaultMovementLog } from 'src/testing/movement-logs.service.mock';

jest.mock('@prisma/client', () => {
  return {
    ...jest.requireActual('@prisma/client'),
    PrismaClient: jest.requireActual('prismock').PrismockClient,
  };
});

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorizationService, DatabaseService],
    }).compile();

    service = module.get<AuthorizationService>(AuthorizationService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should succeed user has access to user resource', async () => {
    const loggedInUserId = defaultUser.id;
    databaseService.user.create({
      data: defaultUser,
    });

    expect(
      await service.userHasAccessToResource(
        loggedInUserId,
        defaultUser.id,
        AuthorizationResourceType.User,
      ),
    ).toBeTruthy();
  });

  it('should fail user has access to user resource', async () => {
    const loggedInUserId = 13;
    databaseService.user.create({
      data: defaultUser,
    });

    expect(
      await service.userHasAccessToResource(
        loggedInUserId,
        defaultUser.id,
        AuthorizationResourceType.User,
      ),
    ).toBeFalsy();
  });

  it('should succeed user has access to movement resource', async () => {
    const loggedInUserId = defaultUser.id;
    databaseService.user.create({
      data: defaultUser,
    });
    const createdMovement = await databaseService.movement.create({
      data: {
        authorId: defaultUser.id,
        ...defaultMovement,
      },
    });

    expect(
      await service.userHasAccessToResource(
        loggedInUserId,
        createdMovement.id,
        AuthorizationResourceType.Movement,
      ),
    ).toBeTruthy();
  });

  it('should fail user has access to movement resource', async () => {
    const loggedInUserId = 13;
    databaseService.user.create({
      data: defaultUser,
    });
    const createdMovement = await databaseService.movement.create({
      data: {
        authorId: defaultUser.id,
        ...defaultMovement,
      },
    });

    expect(
      await service.userHasAccessToResource(
        loggedInUserId,
        createdMovement.id,
        AuthorizationResourceType.Movement,
      ),
    ).toBeFalsy();
  });

  it('should succeed user has access to movement log resource', async () => {
    const loggedInUserId = defaultUser.id;
    databaseService.user.create({
      data: defaultUser,
    });
    const createdMovement = await databaseService.movement.create({
      data: {
        authorId: defaultUser.id,
        ...defaultMovement,
      },
    });
    const createdMovementLog = await databaseService.movementLog.create({
      data: {
        sets: defaultMovementLog.sets,
        reps: defaultMovementLog.reps,
        load: defaultMovementLog.load,
        movementId: createdMovement.id,
      },
    });

    expect(
      await service.userHasAccessToResource(
        loggedInUserId,
        createdMovementLog.id,
        AuthorizationResourceType.MovementLog,
      ),
    ).toBeTruthy();
  });

  it('should fail user has access to movement log resource', async () => {
    const loggedInUserId = 13;
    databaseService.user.create({
      data: defaultUser,
    });
    const createdMovement = await databaseService.movement.create({
      data: {
        authorId: defaultUser.id,
        ...defaultMovement,
      },
    });
    const createdMovementLog = await databaseService.movementLog.create({
      data: {
        sets: defaultMovementLog.sets,
        reps: defaultMovementLog.reps,
        load: defaultMovementLog.load,
        movementId: createdMovement.id,
      },
    });

    expect(
      await service.userHasAccessToResource(
        loggedInUserId,
        createdMovementLog.id,
        AuthorizationResourceType.MovementLog,
      ),
    ).toBeFalsy();
  });
});
