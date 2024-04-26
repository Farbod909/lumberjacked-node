import { Module } from '@nestjs/common';
import { redisClientProvider } from './redis.provider';
import { RedisRepository } from './redis.repository';

@Module({
  providers: [redisClientProvider, RedisRepository],
  exports: [RedisRepository],
})
export class RedisModule {}
