import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyNote } from '../../database/entities/daily-note.entity';
import { Task } from '../../database/entities/task.entity';
import { DailyNotesService } from './daily-notes.service';
import { DailyNotesController } from './daily-notes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyNote, Task])],
  controllers: [DailyNotesController],
  providers: [DailyNotesService],
  exports: [DailyNotesService],
})
export class DailyNotesModule {}
