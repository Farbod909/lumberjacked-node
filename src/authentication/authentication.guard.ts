import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from './session.service';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTHENTICATION_KEY } from './skip-authentication.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuthentication = this.reflector.getAllAndOverride<boolean>(
      SKIP_AUTHENTICATION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skipAuthentication) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.sessionService.getUserSessionInfoFromSession(token);

    if (!user) {
      throw new UnauthorizedException();
    }

    user.access_token = token;
    request['user'] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
