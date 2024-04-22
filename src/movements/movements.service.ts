import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UpdateMovmenentDto } from './dto/update-movement.dto';
import { CreateMovementDto } from './dto/create-movement.dto';

@Injectable()
export class MovementsService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createMovementDto: CreateMovementDto) {
    return this.databaseService.movement.create({
      data: {
        authorId: 2, // TODO: get this from the session once authentication is implemented.
        ...createMovementDto,
      },
    });
  }

  findAll() {
    return this.databaseService.movement.findMany({
      where: {
        authorId: 2, // TODO: get this from the session once authentication is implemented.
      },
    });
  }

  findOne(id: number) {
    return this.databaseService.movement.findUnique({
      where: { id },
    });
  }

  update(id: number, updateMovementDto: UpdateMovmenentDto) {
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
