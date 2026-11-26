import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { DailyLogsService } from './daily-logs.service';
import { UpdateBlockersDto, UpdateSummaryDto } from './dto/daily-log.dto';

@Controller('daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  private getUserId(): number {
    return 1;
  }

  @Get('today')
  async getTodayLog(@Query('date') date?: string) {
    return this.dailyLogsService.getOrCreateDailyLog(this.getUserId(), date);
  }

  @Get('standup')
  async generateStandup(@Query('date') date?: string) {
    return this.dailyLogsService.generateStandup(this.getUserId(), date);
  }

  @Post('blockers')
  async updateBlockers(@Body() dto: UpdateBlockersDto) {
    return this.dailyLogsService.updateBlockers(this.getUserId(), dto);
  }

  @Post('summary')
  async updateSummary(@Body() dto: UpdateSummaryDto) {
    return this.dailyLogsService.updateSummary(this.getUserId(), dto);
  }
}
