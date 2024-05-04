import UserSessionInfo from 'src/authentication/entities/UserSessionInfo';

const defaultToken = '1234';
const defaultUserSessionInfo: UserSessionInfo = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
};

export const sessionsServiceMock = {
  getUserSessionFromSession: jest.fn().mockImplementation((token: string) => {
    return {
      ...defaultUserSessionInfo,
      accessToken: token,
    };
  }),
  createSession: jest.fn().mockImplementation(() => {
    return defaultToken;
  }),
  deleteSession: jest.fn().mockImplementation(() => {
    return;
  }),
  deleteAllSessionsForUser: jest.fn().mockImplementation(() => {
    return;
  }),
};
