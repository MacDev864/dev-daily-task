import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { LookupsModule } from './modules/lookups/lookups.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { DailyNotesModule } from './modules/daily-notes/daily-notes.module';
import { DailyLogsModule } from './modules/daily-logs/daily-logs.module';
import { TimeLogsModule } from './modules/time-logs/time-logs.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mssql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 1433,
        username: process.env.DB_USER || 'sa',
        password: process.env.DB_PASSWORD || 'Password123!',
        database: process.env.DB_NAME || 'DevTasksDB',
        autoLoadEntities: true,
        synchronize: process.env.DB_SYNCHRONIZE !== 'false',
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }),
    }),
    DatabaseModule,
    LookupsModule,
    ProjectsModule,
    TasksModule,
    DailyNotesModule,
    DailyLogsModule,
    TimeLogsModule,
    AuthModule,
  ],
})
export class AppModule {}
