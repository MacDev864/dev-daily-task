# Walkthrough: Developer Daily Task & Work Log System

ระบบจัดการงานและบันทึกช่วยจำประจำวันสำหรับ Developer (Daily Task Planner, Standup Assistant & Memory Scratchpad) พัฒนาด้วย **Nuxt 3 (Frontend)**, **NestJS (Backend)**, **Microsoft SQL Server (MSSQL)** และ **Docker Compose**.

---

## 1. ผลลัพธ์และสิ่งที่พัฒนาแล้วเสร็จ (What was accomplished)

โปรเจกต์ถูกสร้างและวางไว้ที่:
📁 **`C:\Users\phirapat.in\.gemini\antigravity\scratch\dev-daily-task-system`**

### 🧩 1. Docker & Orchestration
- **`docker-compose.yml`**: รัน 3 บริการพร้อม Healthcheck:
  - **`mssql`**: Microsoft SQL Server 2022 (พอร์ต `1433`)
  - **`backend`**: NestJS API (พอร์ต `3001`) พร้อมรอ MSSQL Healthy
  - **`frontend`**: Nuxt 3 Web App (พอร์ต `3000`)
- **`.env.example`** & **`.env`**: ค่า Configuration รหัสผ่านและ JWT Secret

### 🧠 2. Backend (NestJS + TypeORM + MSSQL)
- **Primary Key แบบตัวเลข (Numeric ID)**:
  - Master tables (`task_statuses`, `task_priorities`, `users`, `projects`): ใช้ `int IDENTITY(1,1)`
  - Transaction tables (`tasks`, `daily_notes`, `daily_logs`, `work_time_logs`): ใช้ `bigint IDENTITY(1,1)`
- **ตาราง Master (ตัวพิมพ์เล็ก lowercase)**:
  - `task_statuses`: `backlog` (1), `todo` (2), `in_progress` (3), `in_review` (4), `done` (5)
  - `task_priorities`: `low` (1), `medium` (2), `high` (3), `urgent` (4)
- **Initial Seeder**: บันทึกค่า Master Data และสร้าง Demo User/Project ให้อัตโนมัติเมื่อระบบเริ่มทำงาน
- **Modules & REST Endpoints**:
  - `lookups`: `/api/task-statuses`, `/api/task-priorities`
  - `daily-notes`: บันทึกเตือนความจำ/กันลืม (`GET/POST /api/daily-notes`, `PATCH :id/toggle`, `POST :id/convert-to-task`)
  - `tasks`: จัดการงาน (`GET/POST /api/tasks`, `PATCH :id/status`)
  - `daily-logs`: จัดการ Blockers และสร้าง Standup Markdown (`GET /api/daily-logs/standup`)
  - `time-logs`: บันทึกชั่วโมงทำงาน (`POST /api/time-logs`)
  - `auth`: ระบบล็อกอิน JWT
  - `Swagger`: เอกสาร API อัตโนมัติที่ `/api/docs`

### 💻 3. Frontend (Nuxt 3 + Tailwind CSS + Pinia)
- **Today's Workspace (`/`)**:
  - **Daily Scratchpad Widget (แผงบันทึกความจำกันลืม)**:
    - ช่องพิมพ์จดสิ่งที่ต้องทำสั้นๆ กด Enter เพื่อสร้างทันที
    - มี Checkbox ติ๊กถูกเมื่อทำเสร็จ
    - ปุ่ม **➔ Task**: แปลงบันทึกช่วยจำเป็น Task ทางการใน Project ได้ในคลิกเดียว
    - ตัวกรอง: สิ่งที่ต้องทำ (Pending) / ทำเสร็จแล้ว (Completed)
  - **Quick Task Input**: ช่องสร้างงานใหม่ด่วน พร้อมเลือก Project, Priority และชั่วโมงประมาณการ
  - **Today's Tasks Checklist**: รายการงานประจำวัน มี Badge แสดงสถานะและ Priority จากตาราง Master
  - **Blockers Section**: ช่องจดปัญหาและอุปสรรค
  - **Daily Standup Modal**: ปุ่มกด Generate Standup อัตโนมัติ รวบรวมงานเมื่อวาน, งานวันนี้, และ Blockers พร้อมปุ่ม **"Copy for Slack / Teams"**
- **Kanban Board (`/board`)**:
  - กระดาน 5 คอลัมน์ตามสถานะตัวพิมพ์เล็ก: `backlog` ➔ `todo` ➔ `in_progress` ➔ `in_review` ➔ `done`

---

## 2. วิธีการเริ่มใช้งานระบบ (How to Run)

### ขั้นตอนที่ 1: ตั้งโฟลเดอร์โปรเจกต์เป็น Workspace
เปิด Terminal หรือ IDE ไปที่โฟลเดอร์:
```bash
cd "C:\Users\phirapat.in\.gemini\antigravity\scratch\dev-daily-task-system"
```

### ขั้นตอนที่ 2: เตรียม Environment File
คัดลอกไฟล์ `.env.example` เป็น `.env`:
```bash
cp .env.example .env
```

### ขั้นตอนที่ 3: สั่งรันด้วย Docker Compose
```bash
docker-compose up --build -d
```
*(ระบบจะดึง MSSQL 2022, สร้าง Database `DevTasksDB`, ทำ TypeORM auto-sync ตารางและ Seed ข้อมูลสถานะและความสำคัญให้อัตโนมัติ)*

### ขั้นตอนที่ 4: เข้าใช้งานผ่าน Browser
- **Frontend Web UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)
- **Swagger Documentation**: [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 3. สรุปผลการตรวจสอบ (Verification Results)

| รายการที่ตรวจสอบ | สถานะ | รายละเอียด |
| :--- | :---: | :--- |
| **Frontend: Nuxt 3** | ✅ ผ่าน | มีหน้า Today Workspace, Kanban Board, Store Pinia, Composables และ Components ครบถ้วน |
| **Backend: NestJS** | ✅ ผ่าน | มี TypeORM เชื่อม MSSQL, Entities, DTOs, Controllers, Services และ Seeder ครบถ้วน |
| **Numeric Primary Keys** | ✅ ผ่าน | ตารางทุกตารางใช้ `int` หรือ `bigint IDENTITY(1,1)` เป็น PK |
| **Lowercase Master Tables** | ✅ ผ่าน | แยกตาราง `task_statuses` (1..5: `backlog`..`done`) และ `task_priorities` (1..4: `low`..`urgent`) |
| **Daily Memory Scratchpad** | ✅ ผ่าน | มี `daily_notes` module, checkbox ติ๊กเสร็จ และปุ่ม Convert to Task |
| **Standup Generator** | ✅ ผ่าน | ประมวลผล Markdown สรุป Yesterday / Today / Blockers สำหรับคัดลอกลง Slack/Teams |
