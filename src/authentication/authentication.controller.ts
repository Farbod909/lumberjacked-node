import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDTO } from './dto/login.dto';
import { SkipAuthentication } from './decorators/skip-authentication.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import UserSessionInfo from './entities/UserSessionInfo';
import {
  AuthorizationPolicy,
  AuthorizationResourceType,
  HttpRequestContainer,
} from 'src/authorization/authorization.guard';
import { ChangePasswordDto } from 'src/authentication/dto/change-password.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @SkipAuthentication()
  @Post('login/password')
  login(@Body() loginDto: LoginDTO) {
    return this.authenticationService.login(loginDto);
  }

  @Get('/logout')
  logout(@CurrentUser() user: UserSessionInfo) {
    return this.authenticationService.logout(user.accessToken);
  }

  @Get('/logout-all')
  logoutAllSessions(@CurrentUser() user: UserSessionInfo) {
    return this.authenticationService.logoutAllSessions(user.id);
  }

  /**
   * Change a single user's password.
   * Subsequently logs out of all sessions for this user.
   *
   * Only authorized if this is the logged-in user.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.User,
      resourceIdContainer: HttpRequestContainer.Body,
      resourceIdFieldName: 'userId',
    },
  })
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    await this.authenticationService.changePassword(changePasswordDto);
    await this.authenticationService.logoutAllSessions(
      changePasswordDto.userId,
    );
  }
}
