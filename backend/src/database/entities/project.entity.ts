import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'nvarchar', length: 150 })
  name: string;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  description: string;

  @CreateDateColumn({ type: 'datetime2' })
  created_at: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
