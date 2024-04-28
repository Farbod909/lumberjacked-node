import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateMovementLogDto } from './dto/update-movement-log.dto';
import { CreateMovementLogDto } from './dto/create-movement-log.dto';

@Injectable()
export class MovementLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(movementId: number, createMovementLogDto: CreateMovementLogDto) {
    return this.databaseService.movementLog.create({
      data: {
        movementId,
        ...createMovementLogDto,
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
    return this.databaseService.movementLog.update({
      where: { id },
      data: updateMovementLogDto,
    });
  }

  remove(id: number) {
    return this.databaseService.movementLog.delete({
      where: { id },
    });
  }
}
