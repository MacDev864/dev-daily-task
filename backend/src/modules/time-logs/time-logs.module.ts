import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkTimeLog } from '../../database/entities/work-time-log.entity';
import { DailyLog } from '../../database/entities/daily-log.entity';
import { Task } from '../../database/entities/task.entity';
import { TimeLogsService } from './time-logs.service';
import { TimeLogsController } from './time-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTimeLog, DailyLog, Task])],
  controllers: [TimeLogsController],
  providers: [TimeLogsService],
  exports: [TimeLogsService],
})
export class TimeLogsModule {}
