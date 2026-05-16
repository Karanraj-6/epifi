# API Summary

Base URL locally: `http://localhost:4000`

- `POST /register`
- `POST /login`
- `GET /notes`
- `GET /notes/:id`
- `POST /notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`
- `POST /notes/:id/share`
- `PATCH /notes/:id/favorite`
- `GET /search?q=keyword`
- `GET /openapi.json`
- `GET /about`


## Repository Layer

SQL queries live in ackend/src/repositories. Controllers call repository functions instead of executing SQL directly.


## Database Migrations

Migration files live in ackend/database/migrations and are tracked in the schema_migrations table.
