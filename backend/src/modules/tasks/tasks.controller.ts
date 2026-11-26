import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  private getUserId(): number {
    return 1;
  }

  @Get()
  async getAll(
    @Query('status_id') status_id?: string,
    @Query('project_id') project_id?: string,
  ) {
    return this.tasksService.getAll({
      status_id: status_id ? parseInt(status_id, 10) : undefined,
      project_id: project_id ? parseInt(project_id, 10) : undefined,
      user_id: this.getUserId(),
    });
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(this.getUserId(), dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, dto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status_id', ParseIntPipe) status_id: number,
  ) {
    return this.tasksService.updateStatus(id, status_id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.delete(id);
    return { success: true, message: `Task ${id} deleted` };
  }
}
