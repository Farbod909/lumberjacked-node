import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { RedisRepository } from './redis.repository';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private redisRepository: RedisRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.redisRepository.get_hash('session', token);

    if (!user || Object.keys(user).length == 0) {
      throw new UnauthorizedException();
    }

    user['token'] = token;
    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
