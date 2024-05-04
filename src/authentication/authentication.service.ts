import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import UserSessionInfo from './entities/UserSessionInfo';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly usersService: UsersService,
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
      accessToken: token,
    };
  }

  async logout(token: string) {
    await this.sessionService.deleteSession(token);
  }

  async logoutAllSessions(userId: number) {
    await this.sessionService.deleteAllSessionsForUser(userId);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    if (
      changePasswordDto.newPassword !==
      changePasswordDto.newPasswordConfirmation
    ) {
      throw new BadRequestException('Passwords do not match.');
    }

    const user = await this.usersService.getById(changePasswordDto.userId);
    const currentPasswordIsCorrect = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.hashedPassword,
    );
    if (!currentPasswordIsCorrect) {
      throw new BadRequestException('Current password is wrong.');
    }

    await this.usersService.updatePassword(
      changePasswordDto.userId,
      changePasswordDto.newPassword,
    );
  }
}
