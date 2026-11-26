import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_statuses')
export class TaskStatus {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  code: string; // 'backlog', 'todo', 'in_progress', 'in_review', 'done' (lowercase)

  @Column({ type: 'nvarchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'nvarchar', length: 20, default: '#94a3b8' })
  color: string;

  @OneToMany(() => Task, (task) => task.status)
  tasks: Task[];
}
