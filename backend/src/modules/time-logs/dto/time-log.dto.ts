import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTimeLogDto {
  @IsNotEmpty()
  @IsNumber()
  task_id: number;

  @IsNotEmpty()
  @IsNumber()
  spent_hours: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  log_date?: string;
}
