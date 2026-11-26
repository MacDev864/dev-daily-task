import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from '../entities/task-status.entity';
import { TaskPriority } from '../entities/task-priority.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitialSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(InitialSeeder.name);

  constructor(
    @InjectRepository(TaskStatus)
    private readonly statusRepo: Repository<TaskStatus>,
    @InjectRepository(TaskPriority)
    private readonly priorityRepo: Repository<TaskPriority>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedStatuses();
    await this.seedPriorities();
    await this.seedDefaultProjectAndUser();
  }

  private async seedStatuses() {
    const statuses = [
      { code: 'backlog', name: 'Backlog', sort_order: 1, color: '#94a3b8' },
      { code: 'todo', name: 'To Do', sort_order: 2, color: '#3b82f6' },
      { code: 'in_progress', name: 'In Progress', sort_order: 3, color: '#f59e0b' },
      { code: 'in_review', name: 'In Review', sort_order: 4, color: '#a855f7' },
      { code: 'done', name: 'Done', sort_order: 5, color: '#10b981' },
    ];

    for (const s of statuses) {
      const exists = await this.statusRepo.findOne({ where: { code: s.code } });
      if (!exists) {
        await this.statusRepo.save(this.statusRepo.create(s));
        this.logger.log(`Seeded task status: ${s.code}`);
      }
    }
  }

  private async seedPriorities() {
    const priorities = [
      { code: 'low', name: 'Low', sort_order: 1, color: '#64748b' },
      { code: 'medium', name: 'Medium', sort_order: 2, color: '#3b82f6' },
      { code: 'high', name: 'High', sort_order: 3, color: '#ea580c' },
      { code: 'urgent', name: 'Urgent', sort_order: 4, color: '#ef4444' },
    ];

    for (const p of priorities) {
      const exists = await this.priorityRepo.findOne({ where: { code: p.code } });
      if (!exists) {
        await this.priorityRepo.save(this.priorityRepo.create(p));
        this.logger.log(`Seeded task priority: ${p.code}`);
      }
    }
  }

  private async seedDefaultProjectAndUser() {
    // Seed default user
    let user = await this.userRepo.findOne({ where: { email: 'dev@company.com' } });
    if (!user) {
      const hash = await bcrypt.hash('dev1234', 10);
      user = await this.userRepo.save(
        this.userRepo.create({
          email: 'dev@company.com',
          password_hash: hash,
          full_name: 'Developer One',
          role: 'developer',
        }),
      );
      this.logger.log('Seeded demo user: dev@company.com / dev1234');
    }

    // Seed default project
    const defaultProject = await this.projectRepo.findOne({ where: { code: 'DEV-CORE' } });
    if (!defaultProject) {
      await this.projectRepo.save(
        this.projectRepo.create({
          code: 'DEV-CORE',
          name: 'Core Platform & Services',
          description: 'Main project for development daily tasks',
        }),
      );
      this.logger.log('Seeded default project: DEV-CORE');
    }
  }
}
