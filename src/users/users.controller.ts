import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipAuthentication } from 'src/authentication/decorators/skip-authentication.decorator';
import { CurrentUser } from 'src/authentication/decorators/current-user.decorator';
import UserSessionInfo from 'src/authentication/entities/UserSessionInfo';
import {
  AuthorizationPolicy,
  AuthorizationResourceType,
} from 'src/authorization/authorization.guard';

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
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.User,
    },
  })
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
  getByEmail(
    @CurrentUser() user: UserSessionInfo,
    @Param('email') email: string,
  ) {
    if (user.email !== email) {
      throw new UnauthorizedException();
    }

    return this.usersService.getByEmail(email);
  }

  /**
   * Update a single user based on its id.
   *
   * Only authorized if this is the logged-in user.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.User,
    },
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Change a single user's password.
   *
   * Only authorized if this is the logged-in user.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.User,
    },
  })
  @Put(':id/password')
  changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  /**
   * Delete a user.
   *
   * Only authorized if this is the logged-in user.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.User,
    },
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
