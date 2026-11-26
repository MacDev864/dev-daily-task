import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateBlockersDto {
  @IsNotEmpty()
  @IsString()
  blockers: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class UpdateSummaryDto {
  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
