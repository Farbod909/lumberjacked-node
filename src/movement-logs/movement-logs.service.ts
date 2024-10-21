import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateMovementLogDto } from './dto/update-movement-log.dto';
import { CreateMovementLogDto } from './dto/create-movement-log.dto';

@Injectable()
export class MovementLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(movementId: number, createMovementLogDto: CreateMovementLogDto) {
    let timestamp = new Date();
    if (createMovementLogDto.timestamp) {
      timestamp = new Date(createMovementLogDto.timestamp);
    }
    return this.databaseService.movementLog.create({
      data: {
        movementId,
        ...createMovementLogDto,
        timestamp,
      },
    });
  }

  findAll(movementId: number) {
    return this.databaseService.movementLog.findMany({
      where: { movementId },
    });
  }

  findOne(id: number) {
    return this.databaseService.movementLog.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateMovementLogDto: UpdateMovementLogDto) {
    let timestamp = new Date();
    if (updateMovementLogDto.timestamp) {
      timestamp = new Date(updateMovementLogDto.timestamp);
    }
    return this.databaseService.movementLog.update({
      where: { id },
      data: {
        ...updateMovementLogDto,
        timestamp,
      },
    });
  }

  remove(id: number) {
    return this.databaseService.movementLog.delete({
      where: { id },
    });
  }
}
