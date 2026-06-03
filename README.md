# Task Manager

A full-stack MERN task management application with authentication, drag-and-drop task organization, archiving, pagination, search, rate limiting, and automated testing.

## Live Demo

Frontend: https://task-manager-felipev-gil.vercel.app/

Backend API: https://task-manager-pb69.onrender.com/

## Features

* User authentication with JWT
* Protected routes
* Create, update, delete, and archive tasks
* Kanban board workflow
* Drag-and-drop task management
* Archived tasks page
* Search functionality
* Pagination
* Rate limiting
* Global error handling
* Backend testing with Jest and Supertest

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS
* DaisyUI
* @hello-pangea/dnd
* React Hot Toast
* SweetAlert2
* Lucide React

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* BcryptJS
* Express Validator
* Upstash Rate Limiting

### Testing

* Jest
* Supertest

## Architecture

```text
Frontend (Vercel)
       ↓
Backend API (Render)
       ↓
MongoDB Atlas
```

## Installation

### Clone Repository

```bash
git clone https://github.com/felipev-gil/Task-Manager.git
cd Task-Manager
```

## Backend Setup

```bash
cd backend
pnpm install
```

Create a `.env` file and configure the following variables:

```env
MONGO_URI=

JWT_SECRET=

CORS_ORIGIN=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=
```

Start the backend server:

```bash
pnpm run dev
```

## Frontend Setup

```bash
cd frontend
pnpm install
```

Create a `.env` file and configure the following variable:

```env
VITE_API_URL=
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend application:

```bash
pnpm run dev
```

## Running Tests

Backend tests are implemented using Jest and Supertest.

Run all tests:

```bash
cd backend
pnpm test
```

## Deployment

### Frontend

* Hosted on Vercel
* Automatic deployments through GitHub integration

Required environment variable:

```env
VITE_API_URL=
```

### Backend

* Hosted on Render
* Connected to MongoDB Atlas
* Automatic deployments through GitHub integration

Required environment variables:

```env
MONGO_URI=

JWT_SECRET=

CORS_ORIGIN=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=
```

### Database

* MongoDB Atlas

## Learning Objectives

This project was built to strengthen knowledge and practical experience in:

* React and modern frontend development
* REST API design
* Authentication and authorization with JWT
* MongoDB and Mongoose
* Custom React Hooks
* State management with Context API
* Form validation
* Error handling
* API security practices
* Automated backend testing
* Full-stack deployment

## License

MIT
