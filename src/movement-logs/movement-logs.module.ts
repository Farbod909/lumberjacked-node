import { Module } from '@nestjs/common';
import { MovementLogsService } from './movement-logs.service';
import { MovementLogsController } from './movement-logs.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MovementLogsController],
  providers: [MovementLogsService],
})
export class MovementLogsModule {}
