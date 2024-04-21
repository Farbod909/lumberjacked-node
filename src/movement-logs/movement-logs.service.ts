import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MovementLogsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createMovementLogDto: Prisma.MovementLogCreateInput) {
    return this.databaseService.movementLog.create({
      data: createMovementLogDto,
    });
  }

  findAll(movementId: number) {
    return this.databaseService.movementLog.findMany({
      where: {
        movement: {
          id: movementId,
        },
      },
    });
  }

  findOne(id: number) {
    return this.databaseService.movementLog.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMovementLogDto: Prisma.MovementLogUpdateInput) {
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
