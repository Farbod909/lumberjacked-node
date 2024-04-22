import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovementLogsService } from './movement-logs.service';
import { CreateMovementLogDto } from './dto/create-movement-log.dto';
import { UpdateMovementLogDto } from './dto/update-movement-log.dto';

@Controller('movement-logs')
export class MovementLogsController {
  constructor(private readonly movementLogsService: MovementLogsService) {}

  /**
   * Creates a movement log.
   *
   * Only authorized if logged-in user is author of the movement specified in the request body.
   */
  @Post()
  create(@Body() createMovementLogDto: CreateMovementLogDto) {
    return this.movementLogsService.create(createMovementLogDto);
  }

  /**
   * Get all movement logs based on movement ID.
   *
   * Only authorized if logged-in user is author of the movement.
   */
  @Get('movement/:id')
  findAll(@Param('id') id: number) {
    return this.movementLogsService.findAll(id);
  }

  /**
   * Get a single movement log based on its ID.
   *
   * Only authorized if logged-in user is author of the movement associated with the movement log.
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.movementLogsService.findOne(id);
  }

  /**
   * Update a single movement log based on its ID.
   *
   * Only authorized if logged-in user is author of the movement associated with the movement log.
   */
  @Patch(':id')
  update(
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
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.movementLogsService.remove(id);
  }
}
