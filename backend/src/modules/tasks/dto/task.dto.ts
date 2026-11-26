import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsNumber()
  project_id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  issue_key?: string;

  @IsOptional()
  @IsNumber()
  status_id?: number; // references task_statuses.id (1=backlog, 2=todo, 3=in_progress, 4=in_review, 5=done)

  @IsOptional()
  @IsNumber()
  priority_id?: number; // references task_priorities.id (1=low, 2=medium, 3=high, 4=urgent)

  @IsOptional()
  @IsNumber()
  estimated_hours?: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  issue_key?: string;

  @IsOptional()
  @IsNumber()
  project_id?: number;

  @IsOptional()
  @IsNumber()
  status_id?: number;

  @IsOptional()
  @IsNumber()
  priority_id?: number;

  @IsOptional()
  @IsNumber()
  estimated_hours?: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;
}
