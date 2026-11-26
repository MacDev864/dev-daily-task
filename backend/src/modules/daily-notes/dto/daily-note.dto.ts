import { IsNotEmpty, IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateDailyNoteDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsDateString()
  note_date?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  reminder_time?: Date;
}

export class UpdateDailyNoteDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  is_completed?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  reminder_time?: Date;
}

export class ConvertNoteToTaskDto {
  @IsNotEmpty()
  @IsNumber()
  project_id: number;

  @IsOptional()
  @IsNumber()
  priority_id?: number;

  @IsOptional()
  @IsNumber()
  estimated_hours?: number;
}
