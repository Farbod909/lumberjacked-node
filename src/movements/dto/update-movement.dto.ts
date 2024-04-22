import { PartialType } from '@nestjs/mapped-types';
import { CreateMovementDto } from './create-movement.dto';

export class UpdateMovmenentDto extends PartialType(CreateMovementDto) {}
