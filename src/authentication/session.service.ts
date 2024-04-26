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
    const sessionTtl = 60 * 60 * 24 * 365; // 1 year
    await this.redisRepository.startTransaction();
    await this.redisRepository.setHash('session', token, userSessionInfo);
    await this.redisRepository.setExpiration('session', token, sessionTtl);
    await this.redisRepository.addToSet(
      'sessions-userid',
      userSessionInfo.id.toString(),
      token,
    );
    await this.redisRepository.endTransaction();
    return token;
  }

  async deleteSession(token: string) {
    const userSessionInfo = await this.getUserSessionInfoFromSession(token);
    await this.redisRepository.startTransaction();
    await this.redisRepository.removeFromSet(
      'sessions-userid',
      userSessionInfo.id.toString(),
      token,
    );
    await this.redisRepository.delete('session', token);
    await this.redisRepository.endTransaction();
  }

  async deleteAllSessionsForUser(userId: number) {
    await this.redisRepository.startTransaction();
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
    await this.redisRepository.endTransaction();
  }
}
