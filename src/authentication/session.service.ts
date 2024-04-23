import { Injectable } from '@nestjs/common';
import { RedisRepository } from '../redis/redis.repository';
import * as crypto from 'crypto';
import UserSessionInfo from './entities/UserSessionInfo';

@Injectable()
export class SessionService {
  constructor(private redisRepository: RedisRepository) {}

  async getUserSessionInfoFromSession(token: string) {
    const userSessionInfo: UserSessionInfo = await this.redisRepository.getHash(
      'session',
      token,
    );

    if (Object.keys(userSessionInfo).length == 0) return null;
    return userSessionInfo;
  }

  async createSession(userSessionInfo: UserSessionInfo) {
    const token = crypto.randomBytes(48).toString('hex');
    await this.redisRepository.setHash('session', token, userSessionInfo);
    await this.redisRepository.addToSet(
      'sessions-userid',
      userSessionInfo.id.toString(),
      token,
    );
    return token;
  }

  async deleteSession(token: string) {
    const userSessionInfo = await this.getUserSessionInfoFromSession(token);
    await this.redisRepository.delete('session', token);
    await this.redisRepository.removeFromSet(
      'sessions-userid',
      userSessionInfo.id.toString(),
      token,
    );
  }

  async deleteAllSessionsForUser(userId: number) {
    const tokens = await this.redisRepository.getSet(
      'sessions-userid',
      userId.toString(),
    );

    await Promise.all(
      tokens.map(async (token) => {
        await this.redisRepository.delete('session', token);
      }),
    );

    await this.redisRepository.delete('sessions-userid', userId.toString());
  }
}
