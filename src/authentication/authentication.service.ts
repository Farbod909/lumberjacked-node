import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import UserSessionInfo from './entities/UserSessionInfo';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
  ) {}

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
      access_token: token,
    };
  }

  async logout(token: string) {
    await this.sessionService.deleteSession(token);
  }
}
