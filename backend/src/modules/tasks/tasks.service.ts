import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../database/entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getAll(filters?: {
    status_id?: number;
    project_id?: number;
    user_id?: number;
  }): Promise<Task[]> {
    const qb = this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.status', 'status')
      .leftJoinAndSelect('task.priority', 'priority')
      .leftJoinAndSelect('task.user', 'user')
      .leftJoinAndSelect('task.time_logs', 'time_logs')
      .orderBy('task.created_at', 'DESC');

    if (filters?.status_id) {
      qb.andWhere('task.status_id = :status_id', { status_id: filters.status_id });
    }
    if (filters?.project_id) {
      qb.andWhere('task.project_id = :project_id', { project_id: filters.project_id });
    }
    if (filters?.user_id) {
      qb.andWhere('task.user_id = :user_id', { user_id: filters.user_id });
    }

    return qb.getMany();
  }

  async getById(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['project', 'status', 'priority', 'user', 'time_logs'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepo.create({
      project_id: dto.project_id,
      user_id: userId,
      title: dto.title,
      description: dto.description,
      issue_key: dto.issue_key,
      status_id: dto.status_id || 2, // default 2 ('todo')
      priority_id: dto.priority_id || 2, // default 2 ('medium')
      estimated_hours: dto.estimated_hours || 0,
      due_date: dto.due_date ? new Date(dto.due_date) : null,
    });
    const saved = await this.taskRepo.save(task);
    return this.getById(saved.id);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.getById(id);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.issue_key !== undefined) task.issue_key = dto.issue_key;
    if (dto.project_id !== undefined) task.project_id = dto.project_id;
    if (dto.status_id !== undefined) task.status_id = dto.status_id;
    if (dto.priority_id !== undefined) task.priority_id = dto.priority_id;
    if (dto.estimated_hours !== undefined) task.estimated_hours = dto.estimated_hours;
    if (dto.due_date !== undefined) task.due_date = dto.due_date ? new Date(dto.due_date) : null;

    await this.taskRepo.save(task);
    return this.getById(id);
  }

  async updateStatus(id: number, status_id: number): Promise<Task> {
    const task = await this.getById(id);
    task.status_id = status_id;
    await this.taskRepo.save(task);
    return this.getById(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
