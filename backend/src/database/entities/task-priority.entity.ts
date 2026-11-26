import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_priorities')
export class TaskPriority {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  code: string; // 'low', 'medium', 'high', 'urgent' (lowercase)

  @Column({ type: 'nvarchar', length: 100 })
  name: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'nvarchar', length: 20, default: '#64748b' })
  color: string;

  @OneToMany(() => Task, (task) => task.priority)
  tasks: Task[];
}
