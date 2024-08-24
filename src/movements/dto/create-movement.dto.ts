import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsIntegerRangeString } from 'src/common/validation-decorators/IsIntegerRangeString.decorator';

export class CreateMovementDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  category?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIntegerRangeString({
    canBeSingleInteger: true,
    smallest: 0,
    largest: 100,
  })
  warmupSets?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIntegerRangeString({
    canBeSingleInteger: true,
    smallest: 0,
    largest: 100,
  })
  workingSets?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIntegerRangeString({
    canBeSingleInteger: true,
    smallest: 0,
    largest: 100,
  })
  repRange?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIntegerRangeString({
    canBeSingleInteger: true,
    smallest: 0,
    largest: 10,
  })
  rpe?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3600)
  restTime?: number; // In seconds.
}
