# Epifi Notes App

Full-stack notes app with an Express REST API, Supabase PostgreSQL, JWT authentication, and a React frontend.

## Structure

```text
frontend/   React + Vite client
backend/    Express REST API with controllers, routes, middleware, repositories, and database config
backend/database/migrations/   SQL migration files
docs/       API documentation notes
```

## Backend Features

- `POST /register`
- `POST /login`
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
- `POST /notes/:id/share`
- `GET /search?q=keyword`
- `PATCH /notes/:id/favorite` custom feature
- `GET /openapi.json`
- `GET /about`

## Supabase Setup

1. Create a Supabase project.
2. Copy the project Postgres connection string.
3. Put it in `apps/api/.env` as `DATABASE_URL`.
4. Use the pooler connection string for hosted platforms if Supabase recommends it.

The API runs pending SQL migrations from `backend/database/migrations` on startup when `AUTO_MIGRATE=true`.

## Run Locally

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev:backend
npm run dev:frontend
```

Backend runs on `http://localhost:4000`.
Frontend runs on `http://localhost:5173`.

## Deploy

Deploy `apps/api` as the backend service on Render/Railway/Fly and set:

- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `AUTO_MIGRATE=true`

Deploy `apps/web` as a static site after setting:

- `VITE_API_URL=https://your-api.example.com`
