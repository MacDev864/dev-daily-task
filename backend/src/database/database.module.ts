import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { TaskStatus } from './entities/task-status.entity';
import { TaskPriority } from './entities/task-priority.entity';
import { Task } from './entities/task.entity';
import { DailyNote } from './entities/daily-note.entity';
import { DailyLog } from './entities/daily-log.entity';
import { WorkTimeLog } from './entities/work-time-log.entity';
import { InitialSeeder } from './seeds/initial.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      TaskStatus,
      TaskPriority,
      Task,
      DailyNote,
      DailyLog,
      WorkTimeLog,
    ]),
  ],
  providers: [InitialSeeder],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
