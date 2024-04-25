import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { MovementLogsService } from './movement-logs.service';
import { UpdateMovementLogDto } from './dto/update-movement-log.dto';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { CurrentUser } from 'src/authentication/decorators/current-user.decorator';
import UserSessionInfo from 'src/authentication/entities/UserSessionInfo';

@Controller('movement-logs')
export class MovementLogsController {
  constructor(
    private readonly movementLogsService: MovementLogsService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  /**
   * Get a single movement log based on its ID.
   *
   * Only authorized if logged-in user is author of the movement associated with the movement log.
   */
  @Get(':id')
  async findOne(@CurrentUser() user: UserSessionInfo, @Param('id') id: number) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovementLog(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementLogsService.findOne(id);
  }

  /**
   * Update a single movement log based on its ID.
   *
   * Only authorized if logged-in user is author of the movement associated with the movement log.
   */
  @Patch(':id')
  async update(
    @CurrentUser() user: UserSessionInfo,
    @Param('id') id: number,
    @Body() updateMovementLogDto: UpdateMovementLogDto,
  ) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovementLog(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementLogsService.update(id, updateMovementLogDto);
  }

  /**
   * Delete a single movement log based on its ID.
   *
   * Only authorized if logged-in user is author of the movement associated with the movement log.
   */
  @Delete(':id')
  async remove(@CurrentUser() user: UserSessionInfo, @Param('id') id: number) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovementLog(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementLogsService.remove(id);
  }
}
