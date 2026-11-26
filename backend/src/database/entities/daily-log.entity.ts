import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { WorkTimeLog } from './work-time-log.entity';

@Entity('daily_logs')
export class DailyLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'date' })
  log_date: string; // YYYY-MM-DD

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  summary: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  blockers: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  standup_text: string;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.daily_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => WorkTimeLog, (timeLog) => timeLog.daily_log)
  time_logs: WorkTimeLog[];
}
