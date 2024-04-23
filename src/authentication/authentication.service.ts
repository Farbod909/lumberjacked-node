import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/login.dto';
import { RedisRepository } from './redis.repository';
import * as crypto from 'crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private redisRepository: RedisRepository,
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

    user.hashedPassword = '';

    const token = crypto.randomBytes(48).toString('hex');

    this.redisRepository.set_hash('session', token, user);
    return {
      access_token: token,
    };
  }

  async logout(token: string) {
    await this.redisRepository.delete('session', token);
  }
}
