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

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  /**
   * Creates a movement and sets the currently logged-in user as author.
   */
  @Post()
  create(@Body() createMovementDto: CreateMovementDto) {
    return this.movementsService.create(createMovementDto);
  }

  /**
   * Get all movements for the currently logged-in user.
   */
  @Get()
  findAll() {
    return this.movementsService.findAll();
  }

  /**
   * Get a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of requested movement.
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.movementsService.findOne(id);
  }

  /**
   * Update a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of requested movement.
   */
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMovementDto: UpdateMovmenentDto,
  ) {
    return this.movementsService.update(id, updateMovementDto);
  }

  /**
   * Delete a single movement based on movement ID.
   *
   * Only authorized if logged-in user is author of requested movement.
   */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.movementsService.remove(id);
  }
}
