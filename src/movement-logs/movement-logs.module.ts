import { Module } from '@nestjs/common';
import { MovementLogsService } from './movement-logs.service';
import { MovementLogsController } from './movement-logs.controller';

@Module({
  controllers: [MovementLogsController],
  providers: [MovementLogsService],
})
export class MovementLogsModule {}
