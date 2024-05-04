import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthorizationResourceType } from './authorization.guard';

@Injectable()
export class AuthorizationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async userHasAccessToResource(
    userId: number,
    resourceId: number,
    resourceType: AuthorizationResourceType,
  ) {
    switch (resourceType) {
      case AuthorizationResourceType.User:
        return userId === resourceId;
      case AuthorizationResourceType.Movement:
        return this.userHasAccessToMovement(userId, resourceId);
      case AuthorizationResourceType.MovementLog:
        return this.userHasAccessToMovementLog(userId, resourceId);
    }
  }

  private async userHasAccessToMovement(userId: number, movementId: number) {
    const userOwnsMovement = await this.databaseService.movement
      .findFirst({
        where: { id: movementId, authorId: userId },
      })
      .then((r) => Boolean(r));
    return userOwnsMovement;
  }

  private async userHasAccessToMovementLog(
    userId: number,
    movementLogId: number,
  ) {
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
