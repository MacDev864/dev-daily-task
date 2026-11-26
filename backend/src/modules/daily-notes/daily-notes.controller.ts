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
import { DailyNotesService } from './daily-notes.service';
import { CreateDailyNoteDto, UpdateDailyNoteDto, ConvertNoteToTaskDto } from './dto/daily-note.dto';

@Controller('daily-notes')
export class DailyNotesController {
  constructor(private readonly dailyNotesService: DailyNotesService) {}

  // For quick local usage, default user_id = 1
  private getUserId(): number {
    return 1;
  }

  @Get()
  async getNotes(@Query('date') date?: string) {
    return this.dailyNotesService.getNotes(this.getUserId(), date);
  }

  @Post()
  async createNote(@Body() dto: CreateDailyNoteDto) {
    return this.dailyNotesService.createNote(this.getUserId(), dto);
  }

  @Patch(':id')
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDailyNoteDto,
  ) {
    return this.dailyNotesService.updateNote(this.getUserId(), id, dto);
  }

  @Patch(':id/toggle')
  async toggleComplete(@Param('id', ParseIntPipe) id: number) {
    return this.dailyNotesService.toggleComplete(this.getUserId(), id);
  }

  @Post(':id/convert-to-task')
  async convertToTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConvertNoteToTaskDto,
  ) {
    return this.dailyNotesService.convertToTask(this.getUserId(), id, dto);
  }

  @Delete(':id')
  async deleteNote(@Param('id', ParseIntPipe) id: number) {
    await this.dailyNotesService.deleteNote(this.getUserId(), id);
    return { success: true, message: `Note ${id} deleted` };
  }
}
