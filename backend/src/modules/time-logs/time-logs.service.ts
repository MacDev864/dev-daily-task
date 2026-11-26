import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkTimeLog } from '../../database/entities/work-time-log.entity';
import { DailyLog } from '../../database/entities/daily-log.entity';
import { Task } from '../../database/entities/task.entity';
import { CreateTimeLogDto } from './dto/time-log.dto';

@Injectable()
export class TimeLogsService {
  constructor(
    @InjectRepository(WorkTimeLog)
    private readonly timeLogRepo: Repository<WorkTimeLog>,
    @InjectRepository(DailyLog)
    private readonly dailyLogRepo: Repository<DailyLog>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async createTimeLog(userId: number, dto: CreateTimeLogDto): Promise<WorkTimeLog> {
    const task = await this.taskRepo.findOne({ where: { id: dto.task_id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${dto.task_id} not found`);
    }

    const logDate = dto.log_date || new Date().toISOString().split('T')[0];
    let dailyLog = await this.dailyLogRepo.findOne({ where: { user_id: userId, log_date: logDate } });
    if (!dailyLog) {
      dailyLog = await this.dailyLogRepo.save(
        this.dailyLogRepo.create({ user_id: userId, log_date: logDate }),
      );
    }

    const log = this.timeLogRepo.create({
      task_id: dto.task_id,
      daily_log_id: dailyLog.id,
      spent_hours: dto.spent_hours,
      notes: dto.notes,
    });

    return this.timeLogRepo.save(log);
  }

  async getLogsByTask(taskId: number): Promise<WorkTimeLog[]> {
    return this.timeLogRepo.find({
      where: { task_id: taskId },
      order: { logged_at: 'DESC' },
    });
  }
}
