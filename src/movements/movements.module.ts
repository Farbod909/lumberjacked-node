import { Module } from '@nestjs/common';
import { MovementsService } from './movements.service';
import { MovementsController } from './movements.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';

@Module({
  imports: [DatabaseModule, AuthorizationModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
