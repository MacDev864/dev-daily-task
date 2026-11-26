import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('daily_notes')
export class DailyNote {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'date' })
  note_date: string; // YYYY-MM-DD

  @Column({ type: 'nvarchar', length: 1000 })
  content: string;

  @Column({ type: 'bit', default: false })
  is_completed: boolean;

  @Column({ type: 'nvarchar', length: 50, default: 'scratchpad' })
  category: string;

  @Column({ type: 'bigint', nullable: true })
  converted_task_id: number;

  @Column({ type: 'datetime2', nullable: true })
  reminder_time: Date;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.daily_notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Task, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'converted_task_id' })
  converted_task: Task;
}
