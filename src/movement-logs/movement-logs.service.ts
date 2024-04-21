import { Injectable } from '@nestjs/common';
import { CreateMovementLogDto } from './dto/create-movement-log.dto';
import { UpdateMovementLogDto } from './dto/update-movement-log.dto';

@Injectable()
export class MovementLogsService {
  create(createMovementLogDto: CreateMovementLogDto) {
    return 'This action adds a new movementLog';
  }

  findAll() {
    return `This action returns all movementLogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movementLog`;
  }

  update(id: number, updateMovementLogDto: UpdateMovementLogDto) {
    return `This action updates a #${id} movementLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} movementLog`;
  }
}
