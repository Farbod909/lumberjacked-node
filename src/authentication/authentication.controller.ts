import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDTO } from './dto/login.dto';
import { SkipAuthentication } from './skip-authentication.decorator';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @SkipAuthentication()
  @Post('login/password')
  login(@Body() loginDto: LoginDTO) {
    return this.authenticationService.login(loginDto);
  }

  @Get('/logout')
  logout(@Request() req) {
    return this.authenticationService.logout(req.user.access_token);
  }

  @Get('/logout-all')
  logoutAllSessions(@Request() req) {
    return this.authenticationService.logoutAllSessions(req.user.id);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
