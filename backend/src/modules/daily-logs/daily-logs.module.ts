import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyLog } from '../../database/entities/daily-log.entity';
import { DailyNote } from '../../database/entities/daily-note.entity';
import { Task } from '../../database/entities/task.entity';
import { DailyLogsService } from './daily-logs.service';
import { DailyLogsController } from './daily-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyLog, DailyNote, Task])],
  controllers: [DailyLogsController],
  providers: [DailyLogsService],
  exports: [DailyLogsService],
})
export class DailyLogsModule {}
