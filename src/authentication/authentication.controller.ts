import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDTO } from './dto/login.dto';
import { SkipAuthentication } from './decorators/skip-authentication.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import UserSessionInfo from './entities/UserSessionInfo';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @SkipAuthentication()
  @Post('login/password')
  login(@Body() loginDto: LoginDTO) {
    return this.authenticationService.login(loginDto);
  }

  @Get('/logout')
  logout(@CurrentUser() user) {
    return this.authenticationService.logout(user.access_token);
  }

  @Get('/logout-all')
  logoutAllSessions(@CurrentUser() user: UserSessionInfo) {
    return this.authenticationService.logoutAllSessions(user.id);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: UserSessionInfo) {
    return user;
  }
}
