import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { MovementsModule } from './movements/movements.module';
import { MovementLogsModule } from './movement-logs/movement-logs.module';
import { CommonModule } from './common/common.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RedisModule } from './redis/redis.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthorizationGuard } from './authorization/authorization.guard';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    MovementsModule,
    MovementLogsModule,
    CommonModule,
    AuthenticationModule,
    RedisModule,
    AuthorizationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {}
