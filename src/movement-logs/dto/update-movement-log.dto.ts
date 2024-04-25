import { PartialType } from '@nestjs/mapped-types';
import { CreateMovementLogDto } from './create-movement-log.dto';

export class UpdateMovementLogDto extends PartialType(CreateMovementLogDto) {}
