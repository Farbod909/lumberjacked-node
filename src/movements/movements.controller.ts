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
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovmenentDto } from './dto/update-movement.dto';
import { CurrentUser } from 'src/authentication/decorators/current-user.decorator';
import UserSessionInfo from 'src/authentication/entities/UserSessionInfo';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { CreateMovementLogDto } from 'src/movement-logs/dto/create-movement-log.dto';
import { MovementLogsService } from 'src/movement-logs/movement-logs.service';

@Controller('movements')
export class MovementsController {
  constructor(
    private readonly movementsService: MovementsService,
    private readonly movementLogsService: MovementLogsService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  /**
   * Creates a movement and sets the currently logged-in user as author.
   */
  @Post()
  create(
    @CurrentUser() user: UserSessionInfo,
    @Body() createMovementDto: CreateMovementDto,
  ) {
    return this.movementsService.create(createMovementDto, user.id);
  }

  /**
   * Get all movements for the currently logged-in user.
   */
  @Get()
  findAll(@CurrentUser() user: UserSessionInfo) {
    return this.movementsService.findAll(user.id);
  }

  /**
   * Get a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @Get(':id')
  async findOne(@CurrentUser() user: UserSessionInfo, @Param('id') id: number) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementsService.findOne(id);
  }

  /**
   * Update a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @Patch(':id')
  async update(
    @CurrentUser() user: UserSessionInfo,
    @Param('id') id: number,
    @Body() updateMovementDto: UpdateMovmenentDto,
  ) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementsService.update(id, updateMovementDto);
  }

  /**
   * Delete a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @Delete(':id')
  async remove(@CurrentUser() user: UserSessionInfo, @Param('id') id: number) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementsService.remove(id);
  }

  /**
   * Creates a movement log.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @Post('/:id/logs')
  async createMovementLog(
    @CurrentUser() user: UserSessionInfo,
    @Param() id: number,
    @Body() createMovementLogDto: CreateMovementLogDto,
  ) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementLogsService.create(id, createMovementLogDto);
  }

  /**
   * Get all movement logs for a given movement.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @Get(':id/logs')
  async findAllMovementLogs(
    @CurrentUser() user: UserSessionInfo,
    @Param('id') id: number,
  ) {
    const isAuthorized =
      await this.authorizationService.userHasAccessToMovement(user.id, id);
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }

    return this.movementLogsService.findAll(id);
  }
}
