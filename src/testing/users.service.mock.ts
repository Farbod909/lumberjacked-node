import { ChangePasswordDto } from 'src/users/dto/change-password.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import * as bcrypt from 'bcrypt';
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

export const usersServiceMock = {
  create: jest.fn().mockImplementation(async (createUserDto: CreateUserDto) => {
    return {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: await bcrypt.hash(createUserDto.password, 10),
    };
  }),
  getById: jest.fn().mockImplementation((id: number) => {
    return {
      ...defaultUser,
      id,
    };
  }),
  getByEmail: jest.fn().mockImplementation((email: string) => {
    return {
      ...defaultUser,
      email,
    };
  }),
  update: jest
    .fn()
    .mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
      return {
        ...defaultUser,
        id,
        ...updateUserDto,
      };
    }),
  changePassword: jest
    .fn()
    .mockImplementation(
      async (id: number, changePasswordDto: ChangePasswordDto) => {
        return {
          ...defaultUser,
          id,
          password: await bcrypt.hash(changePasswordDto.newPassword, 10),
        };
      },
    ),
  remove: jest.fn().mockImplementation((id: number) => {
    return {
      ...defaultUser,
      id,
    };
  }),
};
