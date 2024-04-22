import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMovementLogDto } from './create-movement-log.dto';

export class UpdateMovementLogDto extends PartialType(
  OmitType(CreateMovementLogDto, ['movementId'] as const),
) {}
