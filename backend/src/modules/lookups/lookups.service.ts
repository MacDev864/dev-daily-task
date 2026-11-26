import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from '../../database/entities/task-status.entity';
import { TaskPriority } from '../../database/entities/task-priority.entity';

@Injectable()
export class LookupsService {
  constructor(
    @InjectRepository(TaskStatus)
    private readonly statusRepo: Repository<TaskStatus>,
    @InjectRepository(TaskPriority)
    private readonly priorityRepo: Repository<TaskPriority>,
  ) {}

  async getStatuses(): Promise<TaskStatus[]> {
    return this.statusRepo.find({ order: { sort_order: 'ASC' } });
  }

  async getPriorities(): Promise<TaskPriority[]> {
    return this.priorityRepo.find({ order: { sort_order: 'ASC' } });
  }
}
