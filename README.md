# Qatra LMS

Qatra LMS is a modern Learning Management System (LMS) designed for online education. The project consists of a scalable backend API, an admin dashboard, and a mobile application.

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Zod Validation
- Swagger OpenAPI
- Vitest
- Supertest

### DevOps
- GitHub Actions
- Docker (in progress)

---

## Project Structure

```
qatra/
│
├── backend/          # Express API
├── dashboard/        # React Admin Dashboard
├── mobile/           # Flutter Mobile App
├── docs/
├── .github/
└── README.md
```

---

## Features

### Authentication

- Register
- Login
- JWT Authentication
- Role-based Authorization
- Protected Routes

### Course Management

- Create Course
- Update Course
- Delete Course
- Publish Course
- Course Details

### Lessons

- Lesson CRUD
- Video Lessons
- Ordering

### Enrollment

- Enroll Course
- Student Courses

### Progress

- Lesson Progress
- Course Progress
- Continue Learning

### Quiz

- Quiz CRUD
- Questions
- Options
- Submit Quiz

### Certificates

- Generate Certificate
- Course Completion

### Reviews

- Course Reviews
- Ratings

### Admin

- Dashboard
- Student Management
- User Management
- Search
- Statistics

---

## Installation

Clone repository

```bash
git clone https://github.com/ozodbek-ai/qatra.git
```

Enter backend

```bash
cd qatra/backend
```

Install dependencies

```bash
pnpm install
```

---

## Environment Variables

Create a `.env` file.

Example:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Prisma

Generate Client

```bash
pnpm prisma generate
```

Run Migrations

```bash
pnpm prisma migrate dev
```

Open Prisma Studio

```bash
pnpm prisma studio
```

---

## Development

```bash
pnpm dev
```

---

## Testing

Run tests

```bash
pnpm test
```

Run once

```bash
pnpm test:run
```

Coverage

```bash
pnpm coverage
```

---

## Build

```bash
pnpm build
```

---

## API Documentation

Swagger UI

```
http://localhost:3000/api-docs
```

---

## CI

GitHub Actions automatically runs

- Build
- Lint
- Tests

on every push to the main branch.

---

## Roadmap

### Backend

- [x] Authentication
- [x] Courses
- [x] Lessons
- [x] Progress
- [x] Quiz
- [x] Reviews
- [x] Certificates
- [x] Admin Dashboard

### Frontend

- [ ] React Dashboard
- [ ] Student Dashboard
- [ ] Responsive UI

### Mobile

- [ ] Flutter Application

### DevOps

- [ ] Docker
- [ ] Docker Compose
- [ ] Production Deployment

---

## License

MIT

---

Developed by Ozodbek