import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get_hash(prefix: string, key: string): Promise<any | null> {
    return this.redisClient.hgetall(`${prefix}:${key}`);
  }

  async set_hash(prefix: string, key: string, value: any): Promise<void> {
    await this.redisClient.hset(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }
}
