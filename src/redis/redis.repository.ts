import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async startTransaction() {
    await this.redisClient.multi({ pipeline: false });
  }

  async endTransaction() {
    await this.redisClient.exec();
  }

  async setExpiration(prefix: string, key: string, seconds: number) {
    await this.redisClient.expire(`${prefix}:${key}`, seconds);
  }

  async getHash(prefix: string, key: string): Promise<any | null> {
    return this.redisClient.hgetall(`${prefix}:${key}`);
  }

  async setHash(prefix: string, key: string, value: any): Promise<void> {
    await this.redisClient.hset(`${prefix}:${key}`, value);
  }

  async getSet(prefix: string, key: string) {
    return this.redisClient.smembers(`${prefix}:${key}`);
  }

  async addToSet(prefix: string, key: string, value: string | number | Buffer) {
    await this.redisClient.sadd(`${prefix}:${key}`, value);
  }

  async removeFromSet(
    prefix: string,
    key: string,
    value: string | number | Buffer,
  ) {
    await this.redisClient.srem(`${prefix}:${key}`, value);
  }

  async isInSet(prefix: string, key: string, value: string | number | Buffer) {
    return this.redisClient.sismember(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }
}
