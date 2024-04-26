import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { MovementLogsService } from './movement-logs.service';
import { UpdateMovementLogDto } from './dto/update-movement-log.dto';
import { AuthorizationService } from 'src/authorization/authorization.service';
import {
  AuthorizationPolicy,
  AuthorizationResourceType,
} from 'src/authorization/authorization.guard';

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
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.MovementLog,
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.movementLogsService.findOne(id);
  }

  /**
   * Update a single movement log based on its ID.
   *
   * Only authorized if logged-in user is author of the movement associated with the movement log.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.MovementLog,
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMovementLogDto: UpdateMovementLogDto,
  ) {
    return this.movementLogsService.update(id, updateMovementLogDto);
  }

  /**
   * Delete a single movement log based on its ID.
   *
   * Only authorized if logged-in user is author of the movement associated with the movement log.
   */
  @AuthorizationPolicy({
    resourceAccess: {
      resourceType: AuthorizationResourceType.MovementLog,
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.movementLogsService.remove(id);
  }
}
