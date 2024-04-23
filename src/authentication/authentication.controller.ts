import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDTO } from './dto/login.dto';
import { AuthenticationGuard } from './authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login/password')
  login(@Body() loginDto: LoginDTO) {
    return this.authenticationService.login(loginDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/logout')
  logout(@Request() req) {
    console.log(req.user.token);
    return this.authenticationService.logout(req.user.access_token);
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
