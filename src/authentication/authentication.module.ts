import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { RedisRepository } from './redis.repository';
import { redisClientFactory } from './redis.factory';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, RedisRepository, redisClientFactory],
})
export class AuthenticationModule {}
