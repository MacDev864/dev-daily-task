import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DailyLog } from '../../database/entities/daily-log.entity';
import { DailyNote } from '../../database/entities/daily-note.entity';
import { Task } from '../../database/entities/task.entity';
import { UpdateBlockersDto, UpdateSummaryDto } from './dto/daily-log.dto';

@Injectable()
export class DailyLogsService {
  constructor(
    @InjectRepository(DailyLog)
    private readonly logRepo: Repository<DailyLog>,
    @InjectRepository(DailyNote)
    private readonly noteRepo: Repository<DailyNote>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async getOrCreateDailyLog(userId: number, date?: string): Promise<DailyLog> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    let log = await this.logRepo.findOne({
      where: { user_id: userId, log_date: targetDate },
      relations: ['time_logs', 'time_logs.task'],
    });

    if (!log) {
      log = this.logRepo.create({
        user_id: userId,
        log_date: targetDate,
        summary: '',
        blockers: '',
      });
      log = await this.logRepo.save(log);
    }
    return log;
  }

  async updateBlockers(userId: number, dto: UpdateBlockersDto): Promise<DailyLog> {
    const log = await this.getOrCreateDailyLog(userId, dto.date);
    log.blockers = dto.blockers;
    return this.logRepo.save(log);
  }

  async updateSummary(userId: number, dto: UpdateSummaryDto): Promise<DailyLog> {
    const log = await this.getOrCreateDailyLog(userId, dto.date);
    log.summary = dto.summary;
    return this.logRepo.save(log);
  }

  async generateStandup(userId: number, date?: string): Promise<{ standup_markdown: string; standup_text: string }> {
    const todayStr = date || new Date().toISOString().split('T')[0];
    const targetDate = new Date(todayStr);

    // Calculate yesterday date
    const yesterday = new Date(targetDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 1. Yesterday completed tasks & notes
    const completedTasks = await this.taskRepo.find({
      where: { user_id: userId, status_id: 5 }, // 5 = done
      relations: ['project'],
      take: 10,
    });

    const completedNotes = await this.noteRepo.find({
      where: { user_id: userId, note_date: yesterdayStr, is_completed: true },
    });

    // 2. Today in_progress / todo tasks & notes
    const activeTasks = await this.taskRepo.find({
      where: [
        { user_id: userId, status_id: 3 }, // in_progress
        { user_id: userId, status_id: 2 }, // todo
      ],
      relations: ['project'],
    });

    const todayNotes = await this.noteRepo.find({
      where: { user_id: userId, note_date: todayStr },
    });

    // 3. Blockers
    const log = await this.getOrCreateDailyLog(userId, todayStr);
    const blockersText = log.blockers?.trim() || 'None (No blockers)';

    // Build Markdown
    let md = `### 📅 Daily Standup Report (${todayStr})\n\n`;
    
    md += `**✅ What did I do yesterday:**\n`;
    if (completedTasks.length === 0 && completedNotes.length === 0) {
      md += `- Continued routine development & backlog preparation\n`;
    } else {
      completedTasks.forEach((t) => {
        md += `- [${t.project?.code || 'TASK'}] ${t.title} *(Done)*\n`;
      });
      completedNotes.forEach((n) => {
        md += `- ${n.content}\n`;
      });
    }

    md += `\n**🚀 What will I do today:**\n`;
    if (activeTasks.length === 0 && todayNotes.length === 0) {
      md += `- Pick up new tasks from sprint backlog\n`;
    } else {
      activeTasks.forEach((t) => {
        const statusLabel = t.status_id === 3 ? 'In Progress' : 'Planned';
        md += `- [${t.project?.code || 'TASK'}] ${t.title} *(${statusLabel})*\n`;
      });
      todayNotes.filter(n => !n.is_completed).forEach((n) => {
        md += `- [Memo] ${n.content}\n`;
      });
    }

    md += `\n**⚠️ Blockers / Obstacles:**\n`;
    md += `- ${blockersText}\n`;

    // Save standup text into daily log
    log.standup_text = md;
    await this.logRepo.save(log);

    return {
      standup_markdown: md,
      standup_text: md,
    };
  }
}
