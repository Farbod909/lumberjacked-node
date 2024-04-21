import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class MovementsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createMovementDto: Prisma.MovementCreateInput) {
    return this.databaseService.movement.create({
      data: createMovementDto,
    });
  }

  findAll() {
    return this.databaseService.movement.findMany();
  }

  findOne(id: number) {
    return this.databaseService.movement.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMovementDto: Prisma.MovementUpdateInput) {
    return this.databaseService.movement.update({
      where: { id },
      data: updateMovementDto,
    });
  }

  remove(id: number) {
    return this.databaseService.movement.delete({
      where: { id },
    });
  }
}
