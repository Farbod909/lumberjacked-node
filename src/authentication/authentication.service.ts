import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import UserSessionInfo from './entities/UserSessionInfo';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  private usersService: UsersService;
  constructor(
    private readonly sessionService: SessionService,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.usersService = this.moduleRef.get(UsersService, {
      strict: false,
    });
  }

  async login(loginDto: LoginDTO) {
    const user = await this.usersService.getByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Incorrect username or password.');
    }

    const passwordDoesMatch: boolean = await bcrypt.compare(
      loginDto.password,
      user.hashedPassword,
    );

    if (!passwordDoesMatch) {
      throw new UnauthorizedException('Incorrect username or password.');
    }

    const token = await this.sessionService.createSession(
      UserSessionInfo.fromUser(user),
    );
    return {
      accessToken: token,
    };
  }

  async logout(token: string) {
    await this.sessionService.deleteSession(token);
  }

  async logoutAllSessions(userId: number) {
    await this.sessionService.deleteAllSessionsForUser(userId);
  }
}
