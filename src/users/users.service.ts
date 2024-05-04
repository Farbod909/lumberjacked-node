import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
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

  async getById(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return this.databaseService.user.findUnique({
      where: { email },
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

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }

  async updatePassword(id: number, newPassword: string) {
    const saltRounds = 10;
    await this.databaseService.user.update({
      where: { id },
      data: {
        hashedPassword: await bcrypt.hash(newPassword, saltRounds),
      },
    });
  }
}
