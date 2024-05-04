import { UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from 'src/authentication/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from 'src/authentication/dto/change-password.dto';
import { User } from '@prisma/client';

const defaultUser: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@example.com',
  hashedPassword: '123456',
  createdAt: new Date(),
  updatedAt: null,
};
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
  changePassword: jest
    .fn()
    .mockImplementation(async (changePasswordDto: ChangePasswordDto) => {
      return {
        ...defaultUser,
        id: changePasswordDto.userId,
        password: await bcrypt.hash(changePasswordDto.newPassword, 10),
      };
    }),
};
