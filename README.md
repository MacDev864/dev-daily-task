# Developer Daily Task & Work Log System

ระบบจัดการงานและบันทึกช่วยจำประจำวันสำหรับ Developer (Daily Task Planner, Standup Assistant & Memory Scratchpad)

## Tech Stack
- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS / Nuxt UI, Pinia
- **Backend**: NestJS, TypeScript, TypeORM
- **Database**: Microsoft SQL Server (MSSQL 2022)
- **Container**: Docker & Docker Compose

## Quick Start ด้วย Docker Compose

1. สร้างไฟล์ `.env` จาก `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. สั่งรันทุกบริการด้วย Docker:
   ```bash
   docker-compose up --build -d
   ```

3. เข้าใช้งานระบบ:
   - **Frontend (Nuxt 3)**: [http://localhost:3000](http://localhost:3000)
   - **Backend API (NestJS)**: [http://localhost:3001/api](http://localhost:3001/api)
   - **Swagger Docs**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
   - **MSSQL Server**: `localhost:1433` (User: `sa`, Password: ค่าใน `.env`)
"# dev-daily-task" 
