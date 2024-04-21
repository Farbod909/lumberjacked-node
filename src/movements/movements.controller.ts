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
import { Prisma } from '@prisma/client';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createMovementDto: Prisma.MovementCreateInput) {
    return this.movementsService.create(createMovementDto);
  }

  @Get()
  findAll() {
    return this.movementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.movementsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMovementDto: Prisma.MovementUpdateInput,
  ) {
    return this.movementsService.update(id, updateMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.movementsService.remove(id);
  }
}
