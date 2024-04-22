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

  @Post()
  create(@Body() createMovementLogDto: CreateMovementLogDto) {
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
    @Body() updateMovementLogDto: UpdateMovementLogDto,
  ) {
    return this.movementLogsService.update(id, updateMovementLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.movementLogsService.remove(id);
  }
}
