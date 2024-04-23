import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

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

    user.hashedPassword = '';
    // TODO: Generate a token, store it in redis, mapped to user object, and return token here (instead of user object)
    return user;
  }
}
