import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const saltRounds = 10;
    const data = {
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      hashedPassword: await bcrypt.hash(createUserDto.password, saltRounds),
    };
    return this.databaseService.user.create({
      data,
    });
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.password !== changePasswordDto.passwordConfirmation) {
      throw new BadRequestException('Passwords do not match.');
    }
    const saltRounds = 10;
    return this.databaseService.user.update({
      where: { id },
      data: {
        hashedPassword: await bcrypt.hash(
          changePasswordDto.password,
          saltRounds,
        ),
      },
    });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }
}
