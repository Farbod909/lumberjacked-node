import { Module } from '@nestjs/common';
import { MovementLogsService } from './movement-logs.service';
import { MovementLogsController } from './movement-logs.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthorizationModule } from 'src/authorization/authorization.module';

@Module({
  imports: [DatabaseModule, AuthorizationModule],
  controllers: [MovementLogsController],
  providers: [MovementLogsService],
  exports: [MovementLogsService],
})
export class MovementLogsModule {}
