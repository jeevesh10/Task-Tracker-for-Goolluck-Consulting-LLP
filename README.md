# Task Tracker Dashboard

A full-stack **Task Tracker Dashboard** built with **React, TypeScript, Node.js, Express, Prisma, PostgreSQL**, and deployed using **Vercel**, **Render**, and **Neon**.

---

# 🌐 Live Demo

### Frontend (Vercel)

https://task-tracker-for-goolluck-consultin.vercel.app

### Backend API (Render)

https://task-tracker-for-goolluck-consulting-llp.onrender.com

### Health Check

https://task-tracker-for-goolluck-consulting-llp.onrender.com/health

---

# Demo Credentials

Password for all users:

```text
password123
```

| Role | Email |
|------|-------|
| Admin | admin@example.com |
| Manager | manager@example.com |
| Member | member@example.com |
| Member 2 | member2@example.com |

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT Authentication
- bcrypt

## Database

- PostgreSQL (Neon)

## Deployment

- Vercel (Frontend)
- Render (Backend)
- Neon (PostgreSQL)

---

# Features

- JWT Authentication
- Role-Based Access Control
- Task Management
- Task Assignment
- Task Status Tracking
- Comments
- User Management
- Dashboard Analytics
- Responsive Design
- REST APIs
- Docker Support

---

# Project Structure

```
Task-Tracker/
│
├── frontend/
├── backend/
├── docker-compose.yml
├── README.md
```

---

# Running the Project Using Docker

## Prerequisites

- Docker Desktop

### Clone Repository

```bash
git clone https://github.com/jeevesh10/Task-Tracker-for-Goolluck-Consulting-LLP.git

cd Task-Tracker-for-Goolluck-Consulting-LLP
```

### Build and Run

```bash
docker compose up --build
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:3001
```

Health Check

```
http://localhost:3001/health
```

Stop containers

```bash
docker compose down
```

---

# Running Without Docker

## Prerequisites

- Node.js (v20+)
- PostgreSQL

---

## Clone Repository

```bash
git clone https://github.com/jeevesh10/Task-Tracker-for-Goolluck-Consulting-LLP.git

cd Task-Tracker-for-Goolluck-Consulting-LLP
```

---

## Backend Setup

Navigate to backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/task_dashboard"

JWT_SECRET="your-secret-key"

JWT_EXPIRES_IN="24h"

PORT=3001
```

Generate Prisma Client

```bash
npx prisma generate
```

Create Database Tables

```bash
npx prisma db push
```

(Optional) Seed Sample Data

```bash
npm run db:seed
```

Run Backend

```bash
npm run dev
```

Backend URL

```
http://localhost:3001
```

---

## Frontend Setup

Open another terminal

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:3001
```

Run frontend

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Docker Commands

Build

```bash
docker compose build
```

Build without cache

```bash
docker compose build --no-cache
```

Run

```bash
docker compose up
```

Run in background

```bash
docker compose up -d
```

Stop

```bash
docker compose down
```

Remove volumes

```bash
docker compose down -v
```

View logs

```bash
docker compose logs
```

---

# Environment Variables

## Backend

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/task_dashboard

JWT_SECRET=your-secret-key

JWT_EXPIRES_IN=24h

PORT=3001
```

## Frontend

```env
VITE_API_URL=http://localhost:3001
```

---

# Production Environment

## Backend (.env)

```env
DATABASE_URL=<Neon PostgreSQL Connection String>

JWT_SECRET=<Your Secret>

JWT_EXPIRES_IN=24h

PORT=3001

NODE_ENV=production
```

## Frontend (.env)

```env
VITE_API_URL=https://task-tracker-for-goolluck-consulting-llp.onrender.com
```

---

# API Health Check

```
GET /health
```

Response

```json
{
  "status": "ok"
}
```

---

# Deployment

## Frontend

Hosted on **Vercel**

https://task-tracker-for-goolluck-consultin.vercel.app

---

## Backend

Hosted on **Render**

https://task-tracker-for-goolluck-consulting-llp.onrender.com

---

## Database

Hosted on **Neon PostgreSQL**

---

# Repository

https://github.com/jeevesh10/Task-Tracker-for-Goolluck-Consulting-LLP

---

# License

This project was developed as part of the **Goolluck Consulting LLP Full Stack Developer Internship Assignment**.
