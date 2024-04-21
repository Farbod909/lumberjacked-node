import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class MovementLogsService {
  create(createMovementLogDto: Prisma.MovementLogCreateInput) {
    return 'This action adds a new movementLog';
  }

  findAll() {
    return `This action returns all movementLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movementLog`;
  }

  update(id: number, updateMovementLogDto: Prisma.MovementLogUpdateInput) {
    return `This action updates a #${id} movementLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} movementLog`;
  }
}
