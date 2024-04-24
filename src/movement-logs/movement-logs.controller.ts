import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { MovementLogsService } from './movement-logs.service';
import { CreateMovementLogDto } from './dto/create-movement-log.dto';
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
   * Creates a movement log.
   *
   * Only authorized if logged-in user is author of the movement specified in the request body.
   */
  @Post()
  async create(
    @CurrentUser() user: UserSessionInfo,
    @Body() createMovementLogDto: CreateMovementLogDto,
  ) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(
        user.id,
        createMovementLogDto.movementId,
      );
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementLogsService.create(createMovementLogDto);
  }

  /**
   * Get all movement logs based on movement ID.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @Get('movement/:id')
  async findAll(@CurrentUser() user: UserSessionInfo, @Param('id') id: number) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementLogsService.findAll(id);
  }

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
