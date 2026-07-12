# Task Tracker Dashboard

A full-stack Task Tracker application built using **React + TypeScript**, **Node.js + Express**, **PostgreSQL**, **Prisma ORM**, and **Docker**.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt

### Database
- PostgreSQL

### Containerization
- Docker
- Docker Compose

---

# Project Structure

```
task-dashboard/
│
├── frontend/
├── backend/
├── docker-compose.yml
├── README.md
```

---

# Prerequisites

Before running the project, install:

- Docker Desktop
- Node.js (v20 or above)
- PostgreSQL (required only if running without Docker)

---

# Running the Project Using Docker (Recommended)

## 1. Clone the Repository

```bash
git clone <repository-url>
cd task-dashboard
```

## 2. Start Docker Desktop

Ensure Docker Desktop is running.

Verify Docker installation:

```bash
docker --version
docker compose version
```

## 3. Build and Run Containers

```bash
docker compose up --build
```

This command will:

- Build the frontend
- Build the backend
- Start PostgreSQL
- Create Docker network
- Start all containers

## 4. Open the Application

Frontend

```
http://localhost:5173
```

Backend API

```
http://localhost:3001
```

PostgreSQL

```
Host: localhost
Port: 5432
```

## Stop Containers

```bash
docker compose down
```

## Remove Containers and Volumes

```bash
docker compose down -v
```

## Rebuild Containers

```bash
docker compose build --no-cache
docker compose up
```

---

# Running the Project Without Docker

## 1. Install PostgreSQL

Download PostgreSQL:

https://www.postgresql.org/download/windows/

During installation:

- Username: postgres
- Port: 5432
- Set your own password

---

## 2. Create Database

Using pgAdmin or psql:

```sql
CREATE DATABASE task_dashboard;
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=3001

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_dashboard"

JWT_SECRET=your_secret_key
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

---

## 4. Install Backend Dependencies

```bash
cd backend
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Push Database Schema:

```bash
npx prisma db push
```

(Optional) Seed Database:

```bash
npm run db:seed
```

Run Backend:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3001
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Run Frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Useful Docker Commands

View running containers:

```bash
docker ps
```

View logs:

```bash
docker compose logs
```

View backend logs:

```bash
docker compose logs backend
```

View frontend logs:

```bash
docker compose logs frontend
```

View database logs:

```bash
docker compose logs postgres
```

Stop all containers:

```bash
docker compose down
```

Remove containers and volumes:

```bash
docker compose down -v
```

Rebuild the project:

```bash
docker compose up --build
```

---

# Database Configuration

Database Name

```
task_dashboard
```

Default Port

```
5432
```

---

# Environment Variables

Backend `.env`

```env
PORT=3001

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/task_dashboard

JWT_SECRET=your_secret_key
```

---

# Troubleshooting

### Docker is not running

Start Docker Desktop and ensure the Docker Engine is running.

---

### WSL is not installed

Run:

```powershell
wsl --install
```

Restart your computer after installation.

---

### Port Already in Use

Check which process is using the port:

```bash
netstat -ano | findstr :3001
```

or

```bash
netstat -ano | findstr :5173
```

---

### Prisma Errors

```bash
npx prisma generate
npx prisma db push
```

---

### Missing Dependencies

Delete `node_modules` and reinstall dependencies.

Windows CMD:

```cmd
rmdir /s /q node_modules
npm install
```

Linux/macOS:

```bash
rm -rf node_modules
npm install
```

---

# Features

- JWT Authentication
- Role-Based Access Control (Admin, Manager, Member)
- User Management
- Task Creation & Assignment
- Task Status Updates
- Comments
- PostgreSQL Database
- Prisma ORM
- REST APIs
- Responsive Dashboard
- Docker Support

---

# License

This project is intended for educational and assessment purposes.