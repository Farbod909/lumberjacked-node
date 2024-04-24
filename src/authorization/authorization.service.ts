import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async userHasAccessToMovement(userId: number, movementId: number) {
    const userOwnsMovement = await this.databaseService.movement
      .findFirst({
        where: { id: movementId, authorId: userId },
      })
      .then((r) => Boolean(r));
    return userOwnsMovement;
  }

  async userHasAccessToMovementLog(userId: number, movementLogId: number) {
    const userOwnsMovementLog = await this.databaseService.movementLog
      .findFirst({
        where: {
          id: movementLogId,
          movement: {
            authorId: userId,
          },
        },
      })
      .then((r) => Boolean(r));
    return userOwnsMovementLog;
  }
}
