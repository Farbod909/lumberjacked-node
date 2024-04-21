import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { MovementsModule } from './movements/movements.module';

@Module({
  imports: [UsersModule, DatabaseModule, MovementsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
