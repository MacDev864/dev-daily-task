import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../database/entities/project.entity';
import { CreateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async getAll(): Promise<Project[]> {
    return this.projectRepo.find({ order: { name: 'ASC' } });
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const existing = await this.projectRepo.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Project with code ${dto.code} already exists`);
    }
    const project = this.projectRepo.create(dto);
    return this.projectRepo.save(project);
  }
}
