# Task Manager

A full-stack MERN task management application with authentication, drag-and-drop task organization, archiving, pagination, search, rate limiting, and automated testing.

## Features

- User authentication with JWT
- Protected routes
- Create, update, delete, and archive tasks
- Kanban board workflow
- Drag-and-drop task management
- Archived tasks page
- Search functionality
- Pagination
- Rate limiting
- Global error handling
- Backend testing with Jest and Supertest

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- DaisyUI
- @hello-pangea/dnd
- React Hot Toast
- SweetAlert2
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- BcryptJS
- Express Validator
- Upstash Rate Limiting

### Testing

- Jest
- Supertest

## Installation

### Clone Repository

```bash
git clone https://github.com/felipev-gil/Task-Manager.git
cd task-manager
```

### Backend

```bash
cd backend
pnpm install
```

Create a `.env` file and fill the required information:

```env
Server config:
PORT=
CORS_ORIGIN=

Database connection:
MONGO_URI=

Upstash connection:
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

Jwt password:
JWT_SECRET=
```

Run backend:

```bash
pnpm run dev
```

### Frontend

```bash
cd frontend
pnpm install
```

Create a `.env` file and fill the required information:

```env
Api:
VITE_API_URL=
```

Run frontend:

```bash
pnpm run dev
```

## Running Tests

Backend tests are implemented using Jest and Supertest.

```bash
cd backend
pnpm test
```

## Deployment

Frontend:
- Vercel

Backend:
- Render

Database:
- MongoDB Atlas

## License

MIT
