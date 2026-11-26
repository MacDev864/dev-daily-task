import { Controller, Get } from '@nestjs/common';
import { LookupsService } from './lookups.service';

@Controller()
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Get('task-statuses')
  async getStatuses() {
    return this.lookupsService.getStatuses();
  }

  @Get('task-priorities')
  async getPriorities() {
    return this.lookupsService.getPriorities();
  }
}
