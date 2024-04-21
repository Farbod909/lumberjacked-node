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
import { Prisma } from '@prisma/client';

@Controller('movement-logs')
export class MovementLogsController {
  constructor(private readonly movementLogsService: MovementLogsService) {}

  @Post()
  create(@Body() createMovementLogDto: Prisma.MovementLogCreateInput) {
    return this.movementLogsService.create(createMovementLogDto);
  }

  @Get('movement/:id')
  findAll(@Param('id') id: number) {
    return this.movementLogsService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.movementLogsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateMovementLogDto: Prisma.MovementLogUpdateInput,
  ) {
    return this.movementLogsService.update(id, updateMovementLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.movementLogsService.remove(id);
  }
}
