import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UsersService } from 'src/users/users.service';
import { SessionService } from './session.service';
import { usersServiceMock } from 'src/testing/users.service.mock';
import { sessionsServiceMock } from 'src/testing/sessions.service.mock';

// This service is too closely coupled with UsersService to provide any meaninful unit testability.
// Integration tests will be favored instead.
describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService, UsersService, SessionService],
    })
      .overrideProvider(UsersService)
      .useValue(usersServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionsServiceMock)
      .compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
