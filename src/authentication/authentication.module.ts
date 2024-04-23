import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { RedisModule } from 'src/redis/redis.module';
import { SessionService } from './session.service';

@Module({
  imports: [UsersModule, DatabaseModule, RedisModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, SessionService],
  exports: [SessionService],
})
export class AuthenticationModule {}
