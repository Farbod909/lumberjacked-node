import { UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/authentication/dto/login.dto';

export const defaultAccessToken = '1234';
export const defaultInvalidPassword = 'invalid';

export const authenticationServiceMock = {
  login: jest.fn().mockImplementation((loginDto: LoginDTO) => {
    if (loginDto.password === defaultInvalidPassword) {
      throw new UnauthorizedException('Incorrect username or password.');
    }
    return {
      accessToken: defaultAccessToken,
    };
  }),
  logout: jest.fn().mockImplementation(() => {
    return;
  }),
  logoutAllSessions: jest.fn().mockImplementation(() => {
    return;
  }),
  changePassword: jest.fn().mockImplementation(() => {
    return;
  }),
};
