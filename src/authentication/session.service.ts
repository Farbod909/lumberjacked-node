import { Injectable } from '@nestjs/common';
import { RedisRepository } from '../redis/redis.repository';
import * as crypto from 'crypto';
import UserSessionInfo from './entities/UserSessionInfo';

@Injectable()
export class SessionService {
  constructor(private redisRepository: RedisRepository) {}

  async getUserSessionInfoFromSession(token: string) {
    const userSessionInfo: UserSessionInfo =
      await this.redisRepository.get_hash('session', token);

    if (Object.keys(userSessionInfo).length == 0) return null;
    return userSessionInfo;
  }

  async createSession(userSessionInfo: UserSessionInfo) {
    const token = crypto.randomBytes(48).toString('hex');
    await this.redisRepository.set_hash('session', token, userSessionInfo);
    return token;
  }

  async deleteSession(token: string) {
    await this.redisRepository.delete('session', token);
  }

  // async deleteAllSessionsForUser(userId: number) {
  //   //
  // }
}
