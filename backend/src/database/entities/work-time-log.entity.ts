import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './task.entity';
import { DailyLog } from './daily-log.entity';

@Entity('work_time_logs')
export class WorkTimeLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  task_id: number;

  @Column({ type: 'bigint', nullable: true })
  daily_log_id: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  spent_hours: number;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'datetime2' })
  logged_at: Date;

  @ManyToOne(() => Task, (task) => task.time_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => DailyLog, (dailyLog) => dailyLog.time_logs, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'daily_log_id' })
  daily_log: DailyLog;
}
