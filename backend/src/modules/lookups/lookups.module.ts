import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStatus } from '../../database/entities/task-status.entity';
import { TaskPriority } from '../../database/entities/task-priority.entity';
import { LookupsService } from './lookups.service';
import { LookupsController } from './lookups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskStatus, TaskPriority])],
  controllers: [LookupsController],
  providers: [LookupsService],
  exports: [LookupsService],
})
export class LookupsModule {}
