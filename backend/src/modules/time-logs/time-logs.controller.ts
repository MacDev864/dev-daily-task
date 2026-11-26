import { Controller, Post, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TimeLogsService } from './time-logs.service';
import { CreateTimeLogDto } from './dto/time-log.dto';

@Controller('time-logs')
export class TimeLogsController {
  constructor(private readonly timeLogsService: TimeLogsService) {}

  private getUserId(): number {
    return 1;
  }

  @Post()
  async createTimeLog(@Body() dto: CreateTimeLogDto) {
    return this.timeLogsService.createTimeLog(this.getUserId(), dto);
  }

  @Get('task/:taskId')
  async getLogsByTask(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.timeLogsService.getLogsByTask(taskId);
  }
}
