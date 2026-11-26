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
import { Project } from './project.entity';
import { TaskStatus } from './task-status.entity';
import { TaskPriority } from './task-priority.entity';
import { WorkTimeLog } from './work-time-log.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  project_id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @Column({ type: 'int' })
  status_id: number;

  @Column({ type: 'int' })
  priority_id: number;

  @Column({ type: 'nvarchar', length: 255 })
  title: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  description: string;

  @Column({ type: 'nvarchar', length: 50, nullable: true })
  issue_key: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  estimated_hours: number;

  @Column({ type: 'datetime2', nullable: true })
  due_date: Date;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updated_at: Date;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TaskStatus, (status) => status.tasks)
  @JoinColumn({ name: 'status_id' })
  status: TaskStatus;

  @ManyToOne(() => TaskPriority, (priority) => priority.tasks)
  @JoinColumn({ name: 'priority_id' })
  priority: TaskPriority;

  @OneToMany(() => WorkTimeLog, (workLog) => workLog.task)
  time_logs: WorkTimeLog[];
}
