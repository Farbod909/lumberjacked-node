import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipAuthentication } from 'src/authentication/skip-authentication.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a user (aka signup).
   */
  @SkipAuthentication()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Get a single user based on its ID.
   *
   * Only authorized if this is the logged-in user.
   */
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.usersService.getById(id);
  }

  /**
   * Get a single user based on its email.
   *
   * Only authorized if this email belongs to the logged-in user.
   */
  @Get(':email')
  getByEmail(@Param('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  /**
   * Update a single user based on its id.
   *
   * Only authorized if this is the logged-in user.
   */
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Change a single user's password.
   *
   * Only authorized if this is the logged-in user.
   */
  @Put(':id/password')
  changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
