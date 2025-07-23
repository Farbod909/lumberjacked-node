import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovmenentDto } from './dto/update-movement.dto';
import { CurrentUser } from 'src/authentication/decorators/current-user.decorator';
import UserSessionInfo from 'src/authentication/entities/UserSessionInfo';
import { CreateMovementLogDto } from 'src/movement-logs/dto/create-movement-log.dto';
import { MovementLogsService } from 'src/movement-logs/movement-logs.service';
import {
  AuthorizationPolicy,
  AuthorizationResourceType,
} from 'src/authorization/authorization.guard';

@Controller('movements')
export class MovementsController {
  constructor(
    private readonly movementsService: MovementsService,
    private readonly movementLogsService: MovementLogsService,
  ) {}

  /**
   * Creates a movement and sets the currently logged-in user as the author.
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
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.Movement,
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.movementsService.findOne(id);
  }

  /**
   * Update a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.Movement,
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMovementDto: UpdateMovmenentDto,
  ) {
    return this.movementsService.update(id, updateMovementDto);
  }

  /**
   * Delete a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.Movement,
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.movementsService.remove(id);
  }

  /**
   * Creates a movement log.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.Movement,
    },
  })
  @Post('/:id/logs')
  async createMovementLog(
    @Param('id') id: number,
    @Body() createMovementLogDto: CreateMovementLogDto,
  ) {
    return this.movementLogsService.create(id, createMovementLogDto);
  }

  /**
   * Get all movement logs for a given movement.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.Movement,
    },
  })
  @Get(':id/logs')
  async findAllMovementLogs(@Param('id') id: number) {
    return this.movementLogsService.findAll(id);
  }
}
