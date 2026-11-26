-- ============================================================================
-- Database Script: Developer Daily Task & Work Log System
-- DBMS: Microsoft SQL Server (MSSQL 2019 / 2022)
-- Description: สร้างฐานข้อมูล ตาราง Foreign Keys และ Seed Data เริ่มต้น
-- ============================================================================

-- 1. สร้างฐานข้อมูล (หากยังไม่มี)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'DevTasksDB')
BEGIN
    CREATE DATABASE DevTasksDB;
END
GO

USE DevTasksDB;
GO

-- ============================================================================
-- 2. สร้างตาราง Master (Primary Key เป็น INT IDENTITY)
-- ============================================================================

-- ตารางผู้ใช้งาน
IF OBJECT_ID(N'dbo.users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.users (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(150) NOT NULL,
        role NVARCHAR(50) NOT NULL DEFAULT 'developer',
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

-- ตารางโปรเจกต์
IF OBJECT_ID(N'dbo.projects', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.projects (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        code NVARCHAR(50) NOT NULL UNIQUE,
        name NVARCHAR(150) NOT NULL,
        description NVARCHAR(500) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
    );
END
GO

-- ตารางสถานะงาน (Master Table - ค่า code เป็นตัวพิมพ์เล็ก)
IF OBJECT_ID(N'dbo.task_statuses', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.task_statuses (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        code NVARCHAR(50) NOT NULL UNIQUE, -- 'backlog', 'todo', 'in_progress', 'in_review', 'done'
        name NVARCHAR(100) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        color NVARCHAR(20) NOT NULL DEFAULT '#94a3b8'
    );
END
GO

-- ตารางระดับความสำคัญ (Master Table - ค่า code เป็นตัวพิมพ์เล็ก)
IF OBJECT_ID(N'dbo.task_priorities', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.task_priorities (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        code NVARCHAR(50) NOT NULL UNIQUE, -- 'low', 'medium', 'high', 'urgent'
        name NVARCHAR(100) NOT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        color NVARCHAR(20) NOT NULL DEFAULT '#64748b'
    );
END
GO

-- ============================================================================
-- 3. สร้างตาราง Transaction (Primary Key เป็น BIGINT IDENTITY)
-- ============================================================================

-- ตารางงาน (Tasks)
IF OBJECT_ID(N'dbo.tasks', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.tasks (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        project_id INT NOT NULL,
        user_id INT NULL,
        status_id INT NOT NULL,
        priority_id INT NOT NULL,
        title NVARCHAR(255) NOT NULL,
        description NVARCHAR(MAX) NULL,
        issue_key NVARCHAR(50) NULL,
        estimated_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
        due_date DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT FK_tasks_projects FOREIGN KEY (project_id) REFERENCES dbo.projects(id) ON DELETE CASCADE,
        CONSTRAINT FK_tasks_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE SET NULL,
        CONSTRAINT FK_tasks_statuses FOREIGN KEY (status_id) REFERENCES dbo.task_statuses(id),
        CONSTRAINT FK_tasks_priorities FOREIGN KEY (priority_id) REFERENCES dbo.task_priorities(id)
    );
END
GO

-- ตารางบันทึกช่วยจำ/เตือนความจำกันลืมประจำวัน (Daily Scratchpad Notes)
IF OBJECT_ID(N'dbo.daily_notes', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.daily_notes (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        user_id INT NOT NULL,
        note_date DATE NOT NULL,
        content NVARCHAR(1000) NOT NULL,
        is_completed BIT NOT NULL DEFAULT 0,
        category NVARCHAR(50) NOT NULL DEFAULT 'scratchpad',
        converted_task_id BIGINT NULL,
        reminder_time DATETIME2 NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT FK_daily_notes_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE,
        CONSTRAINT FK_daily_notes_tasks FOREIGN KEY (converted_task_id) REFERENCES dbo.tasks(id) ON DELETE SET NULL
    );
END
GO

-- ตารางสรุปการทำงานประจำวัน (Daily Standup Logs)
IF OBJECT_ID(N'dbo.daily_logs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.daily_logs (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        user_id INT NOT NULL,
        log_date DATE NOT NULL,
        summary NVARCHAR(MAX) NULL,
        blockers NVARCHAR(MAX) NULL,
        standup_text NVARCHAR(MAX) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT UQ_daily_logs_user_date UNIQUE (user_id, log_date),
        CONSTRAINT FK_daily_logs_users FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
    );
END
GO

-- ตารางบันทึกเวลาที่ใช้จริง (Work Time Logs)
IF OBJECT_ID(N'dbo.work_time_logs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.work_time_logs (
        id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        task_id BIGINT NOT NULL,
        daily_log_id BIGINT NULL,
        spent_hours DECIMAL(4,2) NOT NULL,
        notes NVARCHAR(500) NULL,
        logged_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT FK_work_time_logs_tasks FOREIGN KEY (task_id) REFERENCES dbo.tasks(id) ON DELETE CASCADE,
        CONSTRAINT FK_work_time_logs_daily_logs FOREIGN KEY (daily_log_id) REFERENCES dbo.daily_logs(id) ON DELETE SET NULL
    );
END
GO

-- ============================================================================
-- 4. ข้อมูลเริ่มต้น (Seed Data)
-- ============================================================================

-- 4.1 Seed ข้อมูลสถานะงาน (task_statuses) - ID ตัวเลข & Code ตัวพิมพ์เล็ก
SET IDENTITY_INSERT dbo.task_statuses ON;

IF NOT EXISTS (SELECT 1 FROM dbo.task_statuses WHERE code = 'backlog')
    INSERT INTO dbo.task_statuses (id, code, name, sort_order, color) VALUES (1, 'backlog', 'Backlog', 1, '#94a3b8');

IF NOT EXISTS (SELECT 1 FROM dbo.task_statuses WHERE code = 'todo')
    INSERT INTO dbo.task_statuses (id, code, name, sort_order, color) VALUES (2, 'todo', 'To Do', 2, '#3b82f6');

IF NOT EXISTS (SELECT 1 FROM dbo.task_statuses WHERE code = 'in_progress')
    INSERT INTO dbo.task_statuses (id, code, name, sort_order, color) VALUES (3, 'in_progress', 'In Progress', 3, '#f59e0b');

IF NOT EXISTS (SELECT 1 FROM dbo.task_statuses WHERE code = 'in_review')
    INSERT INTO dbo.task_statuses (id, code, name, sort_order, color) VALUES (4, 'in_review', 'In Review', 4, '#a855f7');

IF NOT EXISTS (SELECT 1 FROM dbo.task_statuses WHERE code = 'done')
    INSERT INTO dbo.task_statuses (id, code, name, sort_order, color) VALUES (5, 'done', 'Done', 5, '#10b981');

SET IDENTITY_INSERT dbo.task_statuses OFF;
GO

-- 4.2 Seed ข้อมูลระดับความสำคัญ (task_priorities) - ID ตัวเลข & Code ตัวพิมพ์เล็ก
SET IDENTITY_INSERT dbo.task_priorities ON;

IF NOT EXISTS (SELECT 1 FROM dbo.task_priorities WHERE code = 'low')
    INSERT INTO dbo.task_priorities (id, code, name, sort_order, color) VALUES (1, 'low', 'Low', 1, '#64748b');

IF NOT EXISTS (SELECT 1 FROM dbo.task_priorities WHERE code = 'medium')
    INSERT INTO dbo.task_priorities (id, code, name, sort_order, color) VALUES (2, 'medium', 'Medium', 2, '#3b82f6');

IF NOT EXISTS (SELECT 1 FROM dbo.task_priorities WHERE code = 'high')
    INSERT INTO dbo.task_priorities (id, code, name, sort_order, color) VALUES (3, 'high', 'High', 3, '#ea580c');

IF NOT EXISTS (SELECT 1 FROM dbo.task_priorities WHERE code = 'urgent')
    INSERT INTO dbo.task_priorities (id, code, name, sort_order, color) VALUES (4, 'urgent', 'Urgent', 4, '#ef4444');

SET IDENTITY_INSERT dbo.task_priorities OFF;
GO

-- 4.3 Seed ข้อมูลโปรเจกต์ตั้งต้น
IF NOT EXISTS (SELECT 1 FROM dbo.projects WHERE code = 'DEV-CORE')
BEGIN
    INSERT INTO dbo.projects (code, name, description)
    VALUES ('DEV-CORE', 'Core Platform & Services', 'Main development core services & modules');
END
GO

-- 4.4 Seed บัญชีผู้ใช้ตัวอย่าง (Password: dev1234)
IF NOT EXISTS (SELECT 1 FROM dbo.users WHERE email = 'dev@company.com')
BEGIN
    INSERT INTO dbo.users (email, password_hash, full_name, role)
    VALUES (
        'dev@company.com',
        '$2b$10$wEeVsPzN5T4g.8r7o2g76OuEHQO9D0UuU0v.WJm1Gg8k9iE6V0w7y', -- hash of 'dev1234'
        'Developer One',
        'developer'
    );
END
GO

-- ============================================================================
-- 5. ดัชนีเพื่อเพิ่มประสิทธิภาพ (Indexes)
-- ============================================================================
CREATE NONCLUSTERED INDEX IX_tasks_status ON dbo.tasks(status_id);
CREATE NONCLUSTERED INDEX IX_tasks_project ON dbo.tasks(project_id);
CREATE NONCLUSTERED INDEX IX_tasks_user ON dbo.tasks(user_id);
CREATE NONCLUSTERED INDEX IX_daily_notes_user_date ON dbo.daily_notes(user_id, note_date);
GO

PRINT N'Database schema DevTasksDB and seed data created successfully.';
GO
