import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';
import { DailyNote } from './daily-note.entity';
import { DailyLog } from './daily-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'nvarchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'nvarchar', length: 255 })
  password_hash: string;

  @Column({ type: 'nvarchar', length: 150 })
  full_name: string;

  @Column({ type: 'nvarchar', length: 50, default: 'developer' })
  role: string;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => DailyNote, (note) => note.user)
  daily_notes: DailyNote[];

  @OneToMany(() => DailyLog, (log) => log.user)
  daily_logs: DailyLog[];
}
