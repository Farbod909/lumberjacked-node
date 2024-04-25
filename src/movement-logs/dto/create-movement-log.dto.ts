import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class CreateMovementLogDto {
  @IsInt()
  @Min(1)
  @Max(999)
  sets: number;

  @IsInt()
  @Min(1)
  @Max(999)
  reps: number;

  @IsNumber()
  @Min(0)
  @Max(9999)
  load: number;
}
